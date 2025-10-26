Việc cần làm
TOKEN
- [ ] Chỉnh sửa front end để phản ứng với việc hết hạn token => yêu cầu đăng nhập lại
- [ ] Thêm chức năng và database để xử lý refresh token

SYSTEM
- [ ] upon deleting or update products/categories that have image, must DELETE that from the cloud to save storage.

PRODUCT
- [ ] sửa việc cho nhập số lượng hàng tồn là số âm. Kiểm tra các biến khác
- [ ] edit sản phẩm chưa chạy
- [ ] Không cho xóa sản phẩm. Xóa sản phẩm chỉ thực hiện khi có flag isDelete = true.


SHOP
- [ ] Phân trang trong shop. Hiển thị khoảng 10 đến 12

CART
- [ ] cart front end page use hard coded APIs
- [ ] cart change number does not update the database
- [ ] Sửa cập nhật số đếm sản phẩm trên icon giỏ hàng => cần cập nhật ngay lập tức
- [ ] Front end prevent from adding to cart, if no user is logged in. Upon clicking the button, if not log in, system redirect to log in page
- [ ] Tất cả các thao tác trước khi xóa giỏ hàng hoặc xóa sản phẩm, cần phải có warning
- [ ] Lựa chọn một số sản phẩm trong giỏ hàng để thanh toán. Hiện tại là tất cả đều được thanh toán
- [ ] Ấn vào sản phẩm phải chuyển đến trang của sản phẩm đó. Hiện tại là chưa chuyển được


ORDER
- [ ] controller order, that is using hard-coded links, must be fixed, and move to environment file. env cannot be imported for that specific place, reason remains unknown.