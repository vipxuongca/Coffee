import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wrench } from 'lucide-react';

export default function Utilities() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold flex items-center gap-2">
        <Wrench className="w-6 h-6" />
        Tiện ích
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Recalculate Counts */}
        <Card className="rounded-2xl shadow-sm border">
          <CardContent className="p-5 space-y-3">
            <h2 className="text-lg font-medium">Cập nhật thống kê</h2>
            <p className="text-sm text-gray-600">Chạy lại toàn bộ product count theo danh mục.</p>
            <Button className="rounded-xl px-4 py-2 w-full">Recalculate Counts</Button>
          </CardContent>
        </Card>

        {/* Clear Cache */}
        <Card className="rounded-2xl shadow-sm border">
          <CardContent className="p-5 space-y-3">
            <h2 className="text-lg font-medium">Xóa Cache</h2>
            <p className="text-sm text-gray-600">Xóa cache nội bộ để đảm bảo dữ liệu mới nhất.</p>
            <Button className="rounded-xl px-4 py-2 w-full">Clear Cache</Button>
          </CardContent>
        </Card>

        {/* Export Data */}
        <Card className="rounded-2xl shadow-sm border">
          <CardContent className="p-5 space-y-3">
            <h2 className="text-lg font-medium">Xuất dữ liệu</h2>
            <p className="text-sm text-gray-600">Tải xuống snapshot danh mục và sản phẩm.</p>
            <Button className="rounded-xl px-4 py-2 w-full">Export Data</Button>
          </CardContent>
        </Card>

        {/* Health Check */}
        <Card className="rounded-2xl shadow-sm border">
          <CardContent className="p-5 space-y-3">
            <h2 className="text-lg font-medium">Kiểm tra hệ thống</h2>
            <p className="text-sm text-gray-600">Kiểm tra tình trạng kết nối giữa các dịch vụ.</p>
            <Button className="rounded-xl px-4 py-2 w-full">Run Health Check</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}