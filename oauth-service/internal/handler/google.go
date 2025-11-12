package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"os"
	"time"
	// "log"

	"oauth-service/config"
	"oauth-service/internal/utils"
	"oauth-service/models"

	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

var googleOAuthConfig *oauth2.Config

func InitGoogleOAuth() {
	googleOAuthConfig = &oauth2.Config{
		RedirectURL:  config.RedirectURI,
		ClientID:     config.GoogleClientID,
		ClientSecret: config.GoogleClientSecret,
		Scopes:       []string{"openid", "profile", "email"},
		Endpoint:     google.Endpoint,
	}
}


// Redirects user to Google OAuth login page
func GoogleLogin(w http.ResponseWriter, r *http.Request) {
	url := googleOAuthConfig.AuthCodeURL("state-token", oauth2.AccessTypeOffline)

	// log.Println("url is: ",url)
	// log.Println("Redirect is: ",googleOAuthConfig)
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}



// Handles Google OAuth callback
func GoogleCallback(w http.ResponseWriter, r *http.Request) {
	code := r.URL.Query().Get("code")
	if code == "" {
		http.Error(w, "Missing code in request", http.StatusBadRequest)
		return
	}

	// Exchange code for token
	token, err := googleOAuthConfig.Exchange(context.Background(), code)
	if err != nil {
		http.Error(w, "Failed to exchange token", http.StatusInternalServerError)
		return
	}

	client := googleOAuthConfig.Client(context.Background(), token)
	resp, err := client.Get("https://www.googleapis.com/oauth2/v3/userinfo")
	if err != nil {
		http.Error(w, "Failed to get user info", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	var googleUser struct {
		Sub   string `json:"sub"`
		Email string `json:"email"`
		Name  string `json:"name"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&googleUser); err != nil {
		http.Error(w, "Failed to decode user info", http.StatusInternalServerError)
		return
	}

	// Get DB collection
	db := utils.GetDB()
	usersColl := db.Collection("user")

	// Merge logic
	var existingUser models.User
	err = usersColl.FindOne(context.Background(), bson.M{"googleId": googleUser.Sub}).Decode(&existingUser)
	if err == mongo.ErrNoDocuments {
		// check if email exists
		err = usersColl.FindOne(context.Background(), bson.M{"email": googleUser.Email}).Decode(&existingUser)
		if err == mongo.ErrNoDocuments {
			// create new user
			newUser := models.User{
				Email:         googleUser.Email,
				GoogleID:      googleUser.Sub,
				OAuthProvider: "google",
				Name:          googleUser.Name,
			}
			res, _ := usersColl.InsertOne(context.Background(), newUser)
			existingUser.ID = res.InsertedID.(primitive.ObjectID)
			existingUser.Email = newUser.Email
		} else {
			// attach Google to existing account
			update := bson.M{"$set": bson.M{"googleId": googleUser.Sub, "oauthProvider": "google"}}
			usersColl.UpdateByID(context.Background(), existingUser.ID, update)
		}
	}

	// --- Generate JWT ---
	jwtSecret := []byte(os.Getenv("JWT_SECRET"))
	jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": existingUser.ID.Hex(),
		"email":   googleUser.Email,
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	})
	tokenString, err := jwtToken.SignedString(jwtSecret)
	if err != nil {
		http.Error(w, "Failed to generate token", http.StatusInternalServerError)
		return
	}

	// Return JWT as JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"token": tokenString,
		"email": googleUser.Email,
	})
}
