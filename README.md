# Landing Page — Đinh Thị Thu Chang

Landing page giới thiệu 3 mảng dịch vụ: **Visa / Giấy phép lao động / Thẻ tạm trú**,
**Nhập khẩu & phân phối sản phẩm Hàn Quốc** (Hồng Sâm, Mỹ phẩm, Thực phẩm), và
**Phát triển đào tạo nghề**. Hỗ trợ 3 ngôn ngữ Việt / Hàn / Anh, tối ưu để người
xem tin tưởng và liên hệ (gọi điện, Zalo, KakaoTalk).

Stack: Node.js + [Vite](https://vitejs.dev) (HTML/CSS/JS thuần, không framework
UI), deploy tĩnh lên **Cloudflare Pages**.

## Chạy thử local

```bash
npm install
npm run dev
```

Mở http://localhost:5173

## Build production

```bash
npm run build
```

Output nằm ở thư mục `dist/`.

## Bổ sung ảnh thật (quan trọng)

Trang hiện dùng khung ảnh giữ chỗ (placeholder màu kem/vàng) cho các vị trí bên
dưới — do không thể trích xuất trực tiếp ảnh bạn đính kèm trong khung chat ra
file. Lưu đúng tên file vào `public/images/`, sau đó `npm run build` +
deploy lại là ảnh thật sẽ tự hiển thị, không cần sửa code.

| Tên file             | Vị trí sử dụng                                |
|-----------------------|------------------------------------------------|
| `ceo-portrait.jpg`   | Ảnh chân dung Chang ở Hero (đầu trang)          |
| `about-photo.jpg`    | Ảnh chân dung Chang ở mục "Về Chang"            |
| `kakao-qr.png`       | Mã QR KakaoTalk thật (ID: Changkum)             |
| `gallery-1.jpg` … `gallery-6.jpg` | 6 ảnh hoạt động (khai trương, ký kết, tham quan Hàn Quốc...) |

Muốn đổi chú thích/thứ tự gallery: sửa `gallery.captions` trong
`src/i18n/vi.json` / `ko.json` / `en.json`.

## Deploy lên Cloudflare Pages

```bash
# 1. Đăng nhập Cloudflare (mở trình duyệt để xác thực) — chỉ cần làm 1 lần
npx wrangler login

# 2. Build + deploy
npm run deploy
```

`npm run deploy` chạy `vite build` rồi `wrangler pages deploy dist --project-name=chang-landing`.
Lần đầu deploy, Wrangler sẽ hỏi tạo project Pages mới tên `chang-landing` — chọn "Create a new project".

### Gắn domain riêng (dinhthithuchang.com)

Sau khi deploy lần đầu thành công:

1. Vào **Cloudflare Dashboard → Workers & Pages → chang-landing → Custom domains**
2. Thêm `dinhthithuchang.com` (và `www.dinhthithuchang.com` nếu cần)
3. Nếu domain đã nằm trong cùng tài khoản Cloudflare, DNS sẽ tự cấu hình. Nếu domain
   ở nhà đăng ký khác, cần trỏ nameserver về Cloudflare trước.

## Cấu trúc

```
index.html          # Toàn bộ layout, section
src/style.css        # Design tokens + toàn bộ CSS
src/main.js          # i18n switch, render động, tương tác (menu, FAQ, copy Kakao ID...)
src/icons.js          # Bộ icon SVG inline (không dùng emoji/external request)
src/i18n/{vi,ko,en}.json   # Nội dung 3 ngôn ngữ
public/images/        # Nơi đặt ảnh thật (xem bảng trên)
wrangler.toml          # Cấu hình Cloudflare Pages
```

## Liên hệ hiển thị trên trang

- Điện thoại / Zalo: **0988 818 936**
- KakaoTalk ID: **Changkum**
