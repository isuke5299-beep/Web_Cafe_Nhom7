/*
        TÌM KIẾM SẢN PHẨM TRỰC TIẾP TRÊN TRANG (SEARCH)
  */
function xuLyTimKiem(keyword) {
    keyword = keyword.toLowerCase().trim();
    if (!keyword) {
        alert("Vui lòng nhập tên món để tìm!");
        return;
    }

    // Lấy tất cả các thẻ chứa tên sản phẩm
    let danhSachSanPham = document.querySelectorAll(".product-item");
    let tonTaiMon = false;

    // Xóa highlight cũ
    danhSachSanPham.forEach(sp => {
        sp.style.boxShadow = "none";
        sp.style.border = "none";
    });

    // Duyệt để tìm món
    for (let i = 0; i < danhSachSanPham.length; i++) {
        let theSanPham = danhSachSanPham[i];
        let tenMon = theSanPham.querySelector(".product-name").innerText.toLowerCase();

        if (tenMon.includes(keyword)) {

            tonTaiMon = true;
            theSanPham.scrollIntoView({ behavior: 'smooth', block: 'center' });
            theSanPham.style.boxShadow = "0 0 15px #c6893f";
            theSanPham.style.border = "2px solid #c6893f";
            theSanPham.style.borderRadius = "10px";

            // Chỉ tìm món đầu tiên khớp tên
            break;
        }
    }

    if (!tonTaiMon) {
        alert(`Không tìm thấy món nước nào có tên "${keyword}"!`);
    }
}

// Xử lý tìm kiếm cho Desktop
function timKiemSanPham(event) {
    event.preventDefault();
    let inputSearch = document.getElementById("search-input").value;
    xuLyTimKiem(inputSearch);
}

// Xử lý tìm kiếm cho Mobile
function timKiemSanPhamMobile(event) {
    event.preventDefault();
    let inputSearch = document.getElementById("search-input-mobile").value;
    xuLyTimKiem(inputSearch);
}

/* 
   PHẦN 1: XỬ LÝ ĐẶT BÀN (GỬI DỮ LIỆU SANG ADMIN)
*/
let bookingFormElement = document.getElementById("bookingForm");
if (bookingFormElement) {
    bookingFormElement.addEventListener("submit", function (event) {
        event.preventDefault();

        let hoten = document.getElementsByName("hoten")[0].value;
        let dienthoai = document.getElementsByName("dienthoai")[0].value;
        let ngayden = document.getElementsByName("ngayden")[0].value;
        let khunggio = document.getElementsByName("khunggio")[0].value;
        let nhomnguoi = document.getElementsByName("nhomnguoi")[0].value;
        let khuvuc = document.getElementsByName("khuvuc")[0];
        let tenkhuvuc = khuvuc.options[khuvuc.selectedIndex].text;
        let ghichu = document.getElementsByName("ghichu")[0].value;

        if (confirm("Bạn có chắc chắn muốn đặt bàn không?")) {
            let thongTinDatBan = {
                hoten: hoten,
                dienthoai: dienthoai,
                ngayden: ngayden,
                khunggio: khunggio,
                nhomnguoi: nhomnguoi,
                khuvuc: tenkhuvuc,
                ghichu: ghichu
            };

            let danhSach = JSON.parse(localStorage.getItem('DanhSachDatBan')) || [];
            danhSach.push(thongTinDatBan);
            localStorage.setItem('DanhSachDatBan', JSON.stringify(danhSach));

            alert("Đặt bàn thành công! Dữ liệu đã được chuyển sang trang Admin.");
            this.querySelector('form').reset();
        }
    });
}

/* 
    XỬ LÝ KHUNG MIÊU TẢ VÀ ĐẶT HÀNG
*/
function hienChiTiet(ten, gia, mota, anh) {
    document.getElementById("ten-sp").innerText = ten;
    document.getElementById("gia-sp").innerText = gia;
    document.getElementById("noi-dung-mota").innerText = mota;
    document.getElementById("anh-sp").src = anh;

    let oSoLuong = document.getElementById("so-luong-sp");
    if (oSoLuong) oSoLuong.value = 1;

    let khung = document.getElementById("khung-mien-ta");
    khung.style.display = "block";
    khung.scrollIntoView({ behavior: 'smooth' });
}

function dongMieuTa() {
    document.getElementById("khung-mien-ta").style.display = "none";
}

// HÀM MUA SẢN PHẨM 
function datMuaSanPham() {
    const currentUser = sessionStorage.getItem("currentUserName");

    if (!currentUser) {
        alert("Vui lòng đăng nhập trước khi đặt mua món!");
        sessionStorage.setItem("monDangChon", "true");
        window.location.href = "./Dangnhapuser.html";
        return;
    }
    let tenMon = document.getElementById("ten-sp").innerText;
    let giaText = document.getElementById("gia-sp").innerText;
    let giaGocSo = Number(giaText.replace(/\./g, '').replace('đ', '').trim());
    let ngayDat = new Date().toLocaleString('vi-VN');

    let soLuongInput = document.getElementById("so-luong-sp");
    let soLuong = soLuongInput ? Number(soLuongInput.value) : 1;
    if (soLuong < 1) soLuong = 1;

    let tongTienMon = giaGocSo * soLuong;
    let tongTienMonText = tongTienMon.toLocaleString('vi-VN') + ' đ';

    let thongTinDonHang = {
        tenSanPham: tenMon,
        soLuong: soLuong,
        giaHienThi: tongTienMonText,
        giaThucTe: tongTienMon,
        thoiGian: ngayDat
    };

    let danhSachDonHang = JSON.parse(localStorage.getItem('DanhSachDonHangMoi')) || [];
    danhSachDonHang.push(thongTinDonHang);
    localStorage.setItem('DanhSachDonHangMoi', JSON.stringify(danhSachDonHang));

    hienThiDonHangTrangChu();

    alert(`Đã gửi đơn đặt [${soLuong} x ${tenMon}] đến trang Admin thành công!`);
    dongMieuTa();
}

/* 
    BẢNG NHẬN SỐ LIỆU ĐƠN HÀNG TẠI TRANG CHỦ
*/
function hienThiDonHangTrangChu() {
    let danhSachDonHang = JSON.parse(localStorage.getItem('DanhSachDonHangMoi')) || [];
    let tbody = document.getElementById('khach-tb-hang');
    let tongTienSo = 0;

    if (!tbody) return;
    tbody.innerHTML = '';

    if (danhSachDonHang.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Chưa có đơn hàng nào...</td></tr>';
        document.getElementById('khach-tong').innerText = '0 đ';
        return;
    }

    danhSachDonHang.forEach((donHang, index) => {
        let stt = index + 1;
        tongTienSo += (Number(donHang.giaThucTe) || 0);
        let soLuongHienThi = donHang.soLuong || 1;

        let row = `
                    <tr>
                        <td>${stt}</td>
                        <td><strong>${donHang.tenSanPham}</strong></td>
                        <td class="text-center fw-bold">${soLuongHienThi}</td>
                        <td class="text-danger fw-bold">${donHang.giaHienThi}</td>
                        <td>${donHang.thoiGian}</td>
                        <td style="text-align: center;">
                            <button style="background: #ff9800; padding: 6px 14px; font-size: 14px; font-weight: 600; color: white; border: none; cursor: pointer; border-radius: 4px;" onclick="huyDonTrangChu(${index})">Hủy món</button>
                        </td>
                    </tr>
                `;
        tbody.innerHTML += row;
    });

    document.getElementById('khach-tong').innerText = tongTienSo.toLocaleString('vi-VN') + ' đ';
}

function huyDonTrangChu(index) {
    let danhSachDonHang = JSON.parse(localStorage.getItem('DanhSachDonHangMoi')) || [];
    danhSachDonHang.splice(index, 1);
    localStorage.setItem('DanhSachDonHangMoi', JSON.stringify(danhSachDonHang));
    hienThiDonHangTrangChu();
}

/* 
   NHẬN MÓN MỚI TỪ ADMIN 
*/
document.addEventListener("DOMContentLoaded", function () {
    hienThiMonTuAdmin();
    hienThiDonHangTrangChu();
});

function hienThiMonTuAdmin() {
    let products = JSON.parse(localStorage.getItem('DanhSachSanPham')) || [];
    if (products.length === 0) return;

    // Sử dụng một container con riêng biệt để chứa các món Admin thêm vào, tránh việc chèn lại nhiều lần
    let adminContainer = document.getElementById("admin-menu-container");
    adminContainer.innerHTML = "";

    let tieuDe = document.createElement("h3");
    tieuDe.className = "text-center mt-5 mb-4 text-success fw-bold w-100";
    tieuDe.innerText = "⭐ MÓN MỚI TỪ ADMIN ⭐";
    adminContainer.appendChild(tieuDe);

    let row = document.createElement("div");
    row.className = "row justify-content-center g-4 product-row";

    products.forEach(function (sp) {
        let giaDinhDang = Number(sp.gia).toLocaleString('vi-VN') + ' đ';
        let html = `
                    <div class="col-lg-3 col-md-4 col-sm-6 product-item scroll-reveal">
                        <div class="card h-100 shadow-sm border-0 border-top border-success border-3">
                            <img src="${sp.anh}" class="card-img-top" style="height: 160px; object-fit: cover;">
                            <div class="card-body text-center d-flex flex-column">
                                <h5 class="card-title fw-bold product-name">${sp.ten}</h5>
                                <p class="card-text text-warning fw-bold fs-5">${giaDinhDang}</p>
                                <button class="btn btn-success btn-sm mt-auto" onclick="hienChiTiet('${sp.ten}', '${giaDinhDang}', 'Món mới được quản trị viên cập nhật.', '${sp.anh}')">Xem Miêu Tả</button>
                            </div>
                        </div>
                    </div>
                `;
        row.innerHTML += html;
    });
    adminContainer.appendChild(row);
    ganHieuUngCuon(adminContainer);
}

setInterval(hienThiDonHangTrangChu, 2000);
// thay dôi icon thanh ten dang nhap 

let ten = sessionStorage.getItem("currentUserName");

if (ten) {
    document.getElementById("tenNguoiDung").innerText = ten;
}



/* 
    NHẠC NỀN 
*/
document.addEventListener("DOMContentLoaded", function () {
    let bgMusic = document.getElementById("bg-music");
    let hasInteracted = false;

    // Hạ âm lượng 
    if (bgMusic) {
        bgMusic.volume = 0.5; 
    }

    //  tự động phát nhạc 
    function playMusic() {
        if (!hasInteracted && bgMusic) {
            bgMusic.play().then(() => {
                hasInteracted = true;
            }).catch(err => console.log("Trình duyệt chặn phát tự động: ", err));
        }
    }

    //  người dùng click, cuộn trang hoặc nhấn phím
    document.addEventListener("click", playMusic, { once: true });
    document.addEventListener("scroll", playMusic, { once: true });
    document.addEventListener("keydown", playMusic, { once: true });
});







/* =====================================
   KỸ THUẬT INTERSECTION OBSERVER
===================================== */

// Khởi tạo Intersection Observer
const scrollObserver = new IntersectionObserver(
    function (entries, observer) {

        entries.forEach(function (entry) {

            // Kiểm tra sản phẩm đã xuất hiện trên màn hình
            if (entry.isIntersecting) {

                // Thêm class show để kích hoạt CSS
                entry.target.classList.add("show");

                // Ngừng theo dõi sản phẩm đã xuất hiện
                observer.unobserve(entry.target);
            }

        });

    },
    {
        threshold: 0.15
    }
);

// Hàm theo dõi các phần tử có class scroll-reveal
function ganHieuUngCuon(vung = document) {

    const elements = vung.querySelectorAll(
        ".scroll-reveal:not(.show)"
    );

    elements.forEach(function (element) {
        scrollObserver.observe(element);
    });

}

// Chạy sau khi HTML được tải hoàn tất
document.addEventListener("DOMContentLoaded", function () {

    ganHieuUngCuon();

});
