import React, { useEffect } from 'react';
import { useDmc } from '../../context/DmcContext';

type Language = 'en' | 'lo' | 'th' | 'vi' | 'zh' | 'ko';

type TranslationEntry = {
  en: string;
  lo: string;
  th: string;
  vi: string;
  zh: string;
  ko: string;
};

/**
 * Comprehensive 6-language phrase dictionary ordered from longest / most specific
 * phrases to shorter labels so that both exact matches and dynamic string replacements
 * (e.g. "Confirm Withdraw (-1,000,000 LAK)", "Report Singer Register (5)", "MAX (74,600,000)")
 * translate cleanly into Lao (lo), Thai (th), Vietnamese (vi), Chinese (zh), and Korean (ko),
 * and restore to English (en) when English is selected.
 */
const PHRASE_DICTIONARY: TranslationEntry[] = [
  // ============================================================================
  // 1. HEADER & ADMIN NAVIGATION TABS (Visible in Admin & Main App)
  // ============================================================================
  {
    en: 'DMC Party Wallet Balance (Withdraw / Deposit) & Singer Booking (10% Saving for Loan)',
    lo: 'ຍອດເງິນກະເປົາປາຕີ້ DMC (ຖອນ / ຝາກ) & ຈອງນັກຮ້ອງ (ທ້ອນ 10% ເພື່ອກູ້ຢືມ)',
    th: 'ยอดกระเป๋าปาร์ตี้ DMC (ถอน / ฝาก) & จองนักร้อง (ออม 10% เพื่อสินเชื่อ)',
    vi: 'Số dư Ví Tiệc DMC (Rút / Nạp) & Đặt Ca sĩ (Tiết kiệm 10% Vay vốn)',
    zh: 'DMC 派对钱包余额（提款 / 存款）与歌手预订（10% 贷款储蓄）',
    ko: 'DMC 파티 지갑 잔액 (출금 / 입금) 및 가수 예약 (대출용 10% 저축)',
  },
  {
    en: 'DMC Party Wallet Balance (10% Saving for Loan • Withdraw / Deposit)',
    lo: 'ຍອດເງິນກະເປົາປາຕີ້ DMC (ທ້ອນ 10% ເພື່ອກູ້ຢືມ • ຖອນ / ຝາກ)',
    th: 'ยอดกระเป๋าปาร์ตี้ DMC (ออม 10% เพื่อสินเชื่อ • ถอน / ฝาก)',
    vi: 'Số dư Ví Tiệc DMC (Tiết kiệm 10% Vay vốn • Rút / Nạp)',
    zh: 'DMC 派对钱包余额（10% 贷款储蓄 • 提款 / 存款）',
    ko: 'DMC 파티 지갑 잔액 (대출용 10% 저축 • 출금 / 입금)',
  },
  {
    en: 'DMC Party Wallet Balance & Singer Music Cain Party Set Booking',
    lo: 'ຍອດເງິນກະເປົາປາຕີ້ DMC & ລະບົບຈອງຊຸດປາຕີ້ນັກຮ້ອງດົນຕີ DMC',
    th: 'ยอดกระเป๋าปาร์ตี้ DMC & ระบบจองชุดปาร์ตี้นักร้องดนตรี DMC',
    vi: 'Số dư Ví Tiệc DMC & Đặt Gói Tiệc Âm Nhạc Ca Sĩ DMC',
    zh: 'DMC 派对钱包余额与歌手音乐派对套餐预订',
    ko: 'DMC 파티 지갑 잔액 및 가수 뮤직 파티 세트 예약',
  },
  {
    en: 'DMC Party Wallet Balance (Withdraw & 10% Saving for Loan) • Booking Singer Party Set • Report to Administrator Panel',
    lo: 'ຍອດເງິນກະເປົາປາຕີ້ DMC (ຖອນ & ທ້ອນ 10% ເພື່ອກູ້ຢືມ) • ຈອງຊຸດປາຕີ້ນັກຮ້ອງ • ລາຍງານຫາຜູ້ບໍລິຫານ',
    th: 'ยอดกระเป๋าปาร์ตี้ DMC (ถอน & ออม 10% เพื่อสินเชื่อ) • จองชุดปาร์ตี้นักร้อง • รายงานผู้ดูแลระบบ',
    vi: 'Số dư Ví Tiệc DMC (Rút & Tiết kiệm 10% Vay) • Đặt Gói Tiệc Ca Sĩ • Báo cáo Quản trị viên',
    zh: 'DMC 派对钱包余额（提款与 10% 贷款储蓄）• 预订歌手派对套餐 • 报告给管理员面板',
    ko: 'DMC 파티 지갑 잔액 (출금 및 10% 대출 저축) • 가수 파티 세트 예약 • 관리자 패널 보고',
  },
  {
    en: 'Booking Singer Party Set (Who is Booking • Daily Report)',
    lo: 'ຈອງຊຸດປາຕີ້ນັກຮ້ອງ (ຜູ້ຈອງ • ລາຍງານປະຈຳວັນ)',
    th: 'จองชุดปาร์ตี้นักร้อง (ผู้จอง • รายงานประจำวัน)',
    vi: 'Đặt Gói Tiệc Ca Sĩ (Người đặt • Báo cáo hàng ngày)',
    zh: '预订歌手派对套餐（预订人 • 每日报告）',
    ko: '가수 파티 세트 예약 (예약자 • 일일 보고서)',
  },
  {
    en: 'ADMINISTRATOR PANEL • DMC PARTY WALLET BALANCE',
    lo: 'ໜ້າຜູ້ບໍລິຫານ • ຍອດເງິນກະເປົາປາຕີ້ DMC',
    th: 'แผงผู้ดูแลระบบ • ยอดกระเป๋าปาร์ตี้ DMC',
    vi: 'BẢNG QUẢN TRỊ • SỐ DƯ VÍ TIỆC DMC',
    zh: '管理员面板 • DMC 派对钱包余额',
    ko: '관리자 패널 • DMC 파티 지갑 잔액',
  },
  {
    en: 'DMC Party Wallet Balance (Administrator Withdraw)',
    lo: 'ຍອດເງິນກະເປົາປາຕີ້ DMC (ຜູ້ບໍລິຫານຖອນເງິນ)',
    th: 'ยอดกระเป๋าปาร์ตี้ DMC (ผู้ดูแลระบบถอนเงิน)',
    vi: 'Số dư Ví Tiệc DMC (Quản trị viên Rút tiền)',
    zh: 'DMC 派对钱包余额（管理员提款）',
    ko: 'DMC 파티 지갑 잔액 (관리자 출금)',
  },
  {
    en: 'Withdraw from DMC Party Wallet Balance (Administrator)',
    lo: 'ຖອນເງິນຈາກກະເປົາປາຕີ້ DMC (ສຳລັບຜູ້ບໍລິຫານ)',
    th: 'ถอนเงินจากกระเป๋าปาร์ตี้ DMC (สำหรับผู้ดูแลระบบ)',
    vi: 'Rút tiền từ Số dư Ví Tiệc DMC (Quản trị viên)',
    zh: '从 DMC 派对钱包余额提款（管理员）',
    ko: 'DMC 파티 지갑 잔액에서 출금 (관리자)',
  },
  {
    en: 'Administrator Withdraw from 10% Saving for Loan',
    lo: 'ຜູ້ບໍລິຫານຖອນເງິນຈາກຄັງທ້ອນ 10% ເພື່ອກູ້ຢືມ',
    th: 'ผู้ดูแลระบบถอนเงินจากกองทุนออม 10% เพื่อสินเชื่อ',
    vi: 'Quản trị viên rút tiền từ Quỹ Tiết kiệm 10% Vay vốn',
    zh: '管理员从 10% 贷款储蓄中提款',
    ko: '대출용 10% 저축에서 관리자 출금',
  },
  {
    en: 'Receives 3. Selected Package Party Net Credit',
    lo: 'ຮັບຍອດສຸທິຈາກ 3. ແພັກເກັດປາຕີ້ທີ່ເລືອກ',
    th: 'รับยอดสุทธิจาก 3. แพ็กเกจปาร์ตี้ที่เลือก',
    vi: 'Nhận tín dụng ròng từ 3. Gói Tiệc đã chọn',
    zh: '接收 3. 所选派对套餐净额',
    ko: '3. 선택한 파티 패키지 순 크레딧 수령',
  },
  {
    en: 'Disbursed from DMC Party Wallet Balance',
    lo: 'ຈ່າຍອອກຈາກຍອດເງິນກະເປົາປາຕີ້ DMC ແລ້ວ',
    th: 'เบิกจ่ายจากยอดกระเป๋าปาร์ตี้ DMC แล้ว',
    vi: 'Đã giải ngân từ Số dư Ví Tiệc DMC',
    zh: '已从 DMC 派对钱包余额支取',
    ko: 'DMC 파티 지갑 잔액에서 지급됨',
  },
  {
    en: 'Withdraw DMC Party Wallet Balance',
    lo: 'ຖອນເງິນກະເປົາປາຕີ້ DMC',
    th: 'ถอนเงินกระเป๋าปาร์ตี้ DMC',
    vi: 'Rút Số dư Ví Tiệc DMC',
    zh: '提取 DMC 派对钱包余额',
    ko: 'DMC 파티 지갑 잔액 출금',
  },
  {
    en: 'DMC PARTY WALLET PAYOUT BENEFICIARY',
    lo: 'ຜູ້ຮັບເງິນຈ່າຍອອກຈາກກະເປົາປາຕີ້ DMC',
    th: 'ผู้รับเงินโอนจากกระเป๋าปาร์ตี้ DMC',
    vi: 'NGƯỜI THỤ HƯỞNG CHI TRẢ VÍ TIỆC DMC',
    zh: 'DMC 派对钱包付款受益人',
    ko: 'DMC 파티 지갑 지급 수취인',
  },
  {
    en: 'DMC PARTY WALLET BALANCE',
    lo: 'ຍອດເງິນກະເປົາປາຕີ້ DMC',
    th: 'ยอดกระเป๋าปาร์ตี้ DMC',
    vi: 'SỐ DƯ VÍ TIỆC DMC',
    zh: 'DMC 派对钱包余额',
    ko: 'DMC 파티 지갑 잔액',
  },
  {
    en: 'DMC Party Wallet Balance:',
    lo: 'ຍອດເງິນກະເປົາປາຕີ້ DMC:',
    th: 'ยอดกระเป๋าปาร์ตี้ DMC:',
    vi: 'Số dư Ví Tiệc DMC:',
    zh: 'DMC 派对钱包余额:',
    ko: 'DMC 파티 지갑 잔액:',
  },
  {
    en: 'DMC Party Wallet Balance',
    lo: 'ຍອດເງິນກະເປົາປາຕີ້ DMC',
    th: 'ยอดกระเป๋าปาร์ตี้ DMC',
    vi: 'Số dư Ví Tiệc DMC',
    zh: 'DMC 派对钱包余额',
    ko: 'DMC 파티 지갑 잔액',
  },
  {
    en: 'TOTAL ADMIN WITHDRAWALS',
    lo: 'ຍອດຖອນລວມຂອງຜູ້ບໍລິຫານ',
    th: 'ยอดถอนรวมของผู้ดูแลระบบ',
    vi: 'TỔNG TIỀN QUẢN TRỊ VIÊN ĐÃ RÚT',
    zh: '管理员提款总额',
    ko: '관리자 총 출금액',
  },
  {
    en: 'WITHDRAW AMOUNT (LAK) *',
    lo: 'ຈຳນວນເງິນທີ່ຕ້ອງການຖອນ (ກີບ LAK) *',
    th: 'จำนวนเงินที่ต้องการถอน (กีบ LAK) *',
    vi: 'SỐ TIỀN RÚT (LAK) *',
    zh: '提款金额 (LAK) *',
    ko: '출금 금액 (LAK) *',
  },
  {
    en: 'WITHDRAW AMOUNT (LAK)',
    lo: 'ຈຳນວນເງິນທີ່ຕ້ອງການຖອນ (ກີບ LAK)',
    th: 'จำนวนเงินที่ต้องการถอน (กีบ LAK)',
    vi: 'SỐ TIỀN RÚT (LAK)',
    zh: '提款金额 (LAK)',
    ko: '출금 금액 (LAK)',
  },
  {
    en: 'Destination Bank',
    lo: 'ທະນາຄານປາຍທາງ',
    th: 'ธนาคารปลายทาง',
    vi: 'Ngân hàng nhận',
    zh: '收款银行',
    ko: '수취 은행',
  },
  {
    en: 'Beneficiary Account Number',
    lo: 'ເລກບັນຊີຜູ້ຮັບເງິນ',
    th: 'เลขที่บัญชีผู้รับเงิน',
    vi: 'Số tài khoản người nhận',
    zh: '收款人账号',
    ko: '수취인 계좌번호',
  },
  {
    en: 'Beneficiary Account Name',
    lo: 'ຊື່ບັນຊີຜູ້ຮັບເງິນ',
    th: 'ชื่อบัญชีผู้รับเงิน',
    vi: 'Tên tài khoản người nhận',
    zh: '收款人户名',
    ko: '수취인 계좌명',
  },
  {
    en: 'Withdrawal / Loan Purpose Note',
    lo: 'ໝາຍເຫດການຖອນເງິນ / ຈຸດປະສົງການກູ້ຢືມ',
    th: 'หมายเหตุการถอนเงิน / วัตถุประสงค์สินเชื่อ',
    vi: 'Ghi chú Rút tiền / Mục đích Vay',
    zh: '提款 / 贷款用途备注',
    ko: '출금 / 대출 목적 메모',
  },
  {
    en: 'Report to Administrator Panel',
    lo: 'ລາຍງານຫາໜ້າຜູ້ບໍລິຫານ',
    th: 'รายงานไปยังแผงผู้ดูแลระบบ',
    vi: 'Báo cáo lên Bảng Quản trị',
    zh: '报告给管理员面板',
    ko: '관리자 패널에 보고',
  },
  {
    en: 'Report Singer Register',
    lo: 'ລາຍງານການລົງທະບຽນນັກຮ້ອງ',
    th: 'รายงานการลงทะเบียนนักร้อง',
    vi: 'Báo cáo Đăng ký Ca sĩ',
    zh: '歌手注册报告',
    ko: '가수 등록 보고서',
  },
  {
    en: 'Update Package Prices',
    lo: 'ອັບເດດລາຄາແພັກເກັດ',
    th: 'อัปเดตราคาแพ็กเกจ',
    vi: 'Cập nhật Giá Gói',
    zh: '更新套餐价格',
    ko: '패키지 가격 업데이트',
  },
  {
    en: 'Hide Package Prices',
    lo: 'ເຊື່ອງລາຄາແພັກເກັດ',
    th: 'ซ่อนราคาแพ็กเกจ',
    vi: 'Ẩn Giá Gói',
    zh: '隐藏套餐价格',
    ko: '패키지 가격 숨기기',
  },
  {
    en: 'Export Excel/CSV',
    lo: 'ສົ່ງອອກ Excel/CSV',
    th: 'ส่งออก Excel/CSV',
    vi: 'Xuất Excel/CSV',
    zh: '导出 Excel/CSV',
    ko: 'Excel/CSV 내보내기',
  },
  {
    en: '10% SAVING FOR LOAN',
    lo: 'ທ້ອນ 10% ເພື່ອກູ້ຢືມ',
    th: 'ออม 10% เพื่อสินเชื่อ',
    vi: 'TIẾT KIỆM 10% VAY VỐN',
    zh: '10% 贷款储蓄',
    ko: '대출용 10% 저축',
  },
  {
    en: '10% Saving for Loan',
    lo: 'ທ້ອນ 10% ເພື່ອກູ້ຢືມ',
    th: 'ออม 10% เพื่อสินเชื่อ',
    vi: 'Tiết kiệm 10% Vay vốn',
    zh: '10% 贷款储蓄',
    ko: '대출용 10% 저축',
  },
  {
    en: 'All View',
    lo: 'ເບິ່ງທັງໝົດ',
    th: 'ดูทั้งหมด',
    vi: 'Xem tất cả',
    zh: '查看全部',
    ko: '전체 보기',
  },
  {
    en: 'Confirm Withdraw',
    lo: 'ຢືນຢັນການຖອນເງິນ',
    th: 'ยืนยันการถอนเงิน',
    vi: 'Xác nhận Rút tiền',
    zh: '确认提款',
    ko: '출금 확인',
  },
  {
    en: 'Home App (Admin Active)',
    lo: 'ໜ້າຫຼັກແອັບ (ຜູ້ບໍລິຫານ)',
    th: 'หน้าหลักแอป (แอดมินทำงาน)',
    vi: 'Trang chủ App (Admin đang bật)',
    zh: '应用首页（管理员激活）',
    ko: '홈 앱 (관리자 활성)',
  },
  {
    en: 'Home App (User Active)',
    lo: 'ໜ້າຫຼັກແອັບ (ສະມາຊິກ)',
    th: 'หน้าหลักแอป (สมาชิกใช้งาน)',
    vi: 'Trang chủ App (Thành viên)',
    zh: '应用首页（会员激活）',
    ko: '홈 앱 (회원 활성)',
  },
  {
    en: 'Sign In / Sign Out Menu',
    lo: 'ເມນູ ເຂົ້າສູ່ລະບົບ / ອອກລະບົບ',
    th: 'เมนู เข้าสู่ระบบ / ออกจากระบบ',
    vi: 'Menu Đăng nhập / Đăng xuất',
    zh: '登录 / 退出菜单',
    ko: '로그인 / 로그아웃 메뉴',
  },
  {
    en: 'Sign In / Sign Out',
    lo: 'ເຂົ້າສູ່ລະບົບ / ອອກລະບົບ',
    th: 'เข้าสู่ระบบ / ออกจากระบบ',
    vi: 'Đăng nhập / Đăng xuất',
    zh: '登录 / 退出',
    ko: '로그인 / 로그아웃',
  },
  {
    en: 'SIGN IN / SIGN OUT',
    lo: 'ເຂົ້າສູ່ລະບົບ / ອອກລະບົບ',
    th: 'เข้าสู่ระบบ / ออกจากระบบ',
    vi: 'ĐĂNG NHẬP / ĐĂNG XUẤT',
    zh: '登录 / 退出',
    ko: '로그인 / 로그아웃',
  },
  {
    en: 'Sign In / Out',
    lo: 'ເຂົ້າ / ອອກລະບົບ',
    th: 'เข้า / ออกจากระบบ',
    vi: 'Đăng nhập / Xuất',
    zh: '登录 / 退出',
    ko: '로그인 / 로그아웃',
  },
  {
    en: 'Update My Profile / Password',
    lo: 'ອັບເດດໂປຣໄຟລ໌ / ລະຫັດຜ່ານຂອງຂ້ອຍ',
    th: 'อัปเดตโปรไฟล์ / รหัสผ่านของฉัน',
    vi: 'Cập nhật Hồ sơ / Mật khẩu của tôi',
    zh: '更新我的个人资料 / 密码',
    ko: '내 프로필 / 비밀번호 업데이트',
  },
  {
    en: '+ My QR Code Bank Account',
    lo: '+ ບັນຊີທະນາຄານ QR Code ຂອງຂ້ອຍ',
    th: '+ บัญชีธนาคาร QR Code ของฉัน',
    vi: '+ Tài khoản Ngân hàng QR của tôi',
    zh: '+ 我的二维码银行账户',
    ko: '+ 내 QR 코드 은행 계좌',
  },
  {
    en: 'Full User Control Panel',
    lo: 'ແຜງຄວບຄຸມບັນຊີຜູ້ໃຊ້ທັງໝົດ',
    th: 'แผงควบคุมบัญชีผู้ใช้ทั้งหมด',
    vi: 'Bảng Điều khiển Người dùng Đầy đủ',
    zh: '完整用户控制面板',
    ko: '전체 사용자 제어판',
  },

  // ============================================================================
  // 2. ALL 19 ADMIN PORTAL TABS & ADMIN HEADINGS
  // ============================================================================
  {
    en: '1/ Design Business Cards',
    lo: '1/ ອອກແບບນາມບັດ (Business Cards)',
    th: '1/ ออกแบบนามบัตร (Business Cards)',
    vi: '1/ Thiết kế Danh thiếp',
    zh: '1/ 设计名片',
    ko: '1/ 명함 디자인',
  },
  {
    en: '2/ Step-By-Step Summary PDF',
    lo: '2/ ສະຫຼຸບຂັ້ນຕອນການເຮັດວຽກ PDF',
    th: '2/ สรุปขั้นตอนการทำงาน PDF',
    vi: '2/ Tóm tắt Từng bước PDF',
    zh: '2/ 分步操作指南 PDF',
    ko: '2/ 단계별 요약 가이드 PDF',
  },
  {
    en: 'Company Profile PDF',
    lo: 'ໂປຣໄຟລ໌ບໍລິສັດ PDF',
    th: 'โปรไฟล์บริษัท PDF',
    vi: 'Hồ sơ Công ty PDF',
    zh: '公司简介 PDF',
    ko: '회사 소개서 PDF',
  },
  {
    en: 'Report Files CRUD (1-8)',
    lo: 'ໄຟລ໌ລາຍງານ CRUD (1-8)',
    th: 'ไฟล์รายงาน CRUD (1-8)',
    vi: 'Tệp Báo cáo CRUD (1-8)',
    zh: '报表文件管理 CRUD (1-8)',
    ko: '보고서 파일 CRUD (1-8)',
  },
  {
    en: 'Privacy & Policy CRUD',
    lo: 'ນະໂຍບາຍ & ຂໍ້ກຳນົດ CRUD',
    th: 'นโยบาย & ข้อกำหนด CRUD',
    vi: 'Chính sách & Điều khoản CRUD',
    zh: '隐私与政策管理 CRUD',
    ko: '개인정보 및 정책 CRUD',
  },
  {
    en: 'Members CRUD',
    lo: 'ຈັດການສະມາຊິກ CRUD',
    th: 'จัดการสมาชิก CRUD',
    vi: 'Quản lý Thành viên CRUD',
    zh: '会员管理 CRUD',
    ko: '회원 관리 CRUD',
  },
  {
    en: 'Staff & Positions (8)',
    lo: 'ທີມງານ & ຕຳແໜ່ງ (8)',
    th: 'ทีมงาน & ตำแหน่ง (8)',
    vi: 'Nhân sự & Chức vụ (8)',
    zh: '员工与职位 (8)',
    ko: '스태프 및 직책 (8)',
  },
  {
    en: 'Studio Songs',
    lo: 'ເພງສະຕູດິໂອ',
    th: 'เพลงสตูดิโอ',
    vi: 'Bài hát Phòng thu',
    zh: '录音室歌曲',
    ko: '스튜디오 곡',
  },
  {
    en: 'Payout Approvals',
    lo: 'ອະນຸມັດການຈ່າຍເງິນ',
    th: 'อนุมัติการจ่ายเงิน',
    vi: 'Phê duyệt Chi trả',
    zh: '提款付款审批',
    ko: '출금 지급 승인',
  },
  {
    en: 'Lao Banks & Payout',
    lo: 'ທະນາຄານລາວ & ບັນຊີຈ່າຍເງິນ',
    th: 'ธนาคารลาว & บัญชีจ่ายเงิน',
    vi: 'Ngân hàng Lào & Chi trả',
    zh: '老挝银行与收付款',
    ko: '라오스 은행 및 지급',
  },
  {
    en: 'Commission Splits',
    lo: 'ກົດລະບຽບແບ່ງຄອມມິດຊັ່ນ',
    th: 'กฎการแบ่งคอมมิชชัน',
    vi: 'Quy tắc Chia Hoa hồng',
    zh: '佣金分配规则',
    ko: '커미션 분배 규칙',
  },
  {
    en: 'UAT Matrix (A01-E06)',
    lo: 'ตารางກວດສອບລະບົບ (A01-E06)',
    th: 'ตารางทดสอบระบบ (A01-E06)',
    vi: 'Ma trận Kiểm thử (A01-E06)',
    zh: '系统验收矩阵 (A01-E06)',
    ko: '시스템 검증 매트릭스 (A01-E06)',
  },
  {
    en: 'System Logs',
    lo: 'ປະຫວັດລະບົບ (System Logs)',
    th: 'ประวัติระบบ (System Logs)',
    vi: 'Nhật ký Hệ thống',
    zh: '系统审计日志',
    ko: '시스템 로그',
  },
  {
    en: '2/ Certificate & Complete',
    lo: '2/ ໃບຢັ້ງຢືນ & ຈົບຫຼັກສູດ',
    th: '2/ ใบรับรอง & จบหลักสูตร',
    vi: '2/ Chứng chỉ & Hoàn thành',
    zh: '2/ 证书与结业',
    ko: '2/ 수료증 및 완료',
  },
  {
    en: 'Contract Agreement',
    lo: 'ສັນຍາຂໍ້ຕົກລົງ (Contract)',
    th: 'สัญญาข้อตกลง (Contract)',
    vi: 'Hợp đồng Thỏa thuận',
    zh: '合同协议',
    ko: '계약서 관리',
  },
  {
    en: 'Maker / Checker Payouts',
    lo: 'ອະນຸມັດການຖອນເງິນ (Maker / Checker)',
    th: 'อนุมัติการถอนเงิน (Maker / Checker)',
    vi: 'Duyệt Chi trả (Maker / Checker)',
    zh: '双重审核付款 (Maker / Checker)',
    ko: '출금 이중 승인 (Maker / Checker)',
  },
  {
    en: 'QR Bank & Payments',
    lo: 'QR ທະນາຄານ & ການຊຳລະເງິນ',
    th: 'QR ธนาคาร & การชำระเงิน',
    vi: 'QR Ngân hàng & Thanh toán',
    zh: '银行二维码与支付',
    ko: '은행 QR 및 결제',
  },
  {
    en: '3-Level Commission Audit',
    lo: 'ກວດສອບຄ່າຄອມມິດຊັ່ນ 3 ຊັ້ນ',
    th: 'ตรวจสอบคอมมิชชัน 3 ชั้น',
    vi: 'Kiểm toán Hoa hồng 3 Cấp',
    zh: '3 级佣金审计',
    ko: '3단계 커미션 감사',
  },
  {
    en: 'Registered Users',
    lo: 'ສະມາຊິກທີ່ລົງທະບຽນ',
    th: 'สมาชิกที่ลงทะเบียน',
    vi: 'Thành viên Đã đăng ký',
    zh: '注册用户',
    ko: '등록된 회원',
  },
  {
    en: 'Downline Organize Tree',
    lo: 'ຜັງອົງກອນສາຍງານ (Downline Tree)',
    th: 'ผังองค์กรสายงาน (Downline Tree)',
    vi: 'Cây Hệ thống Tuyến dưới',
    zh: '下线组织结构树',
    ko: '하위 조직도 트리',
  },
  {
    en: 'Event & Activity Posts',
    lo: 'ໂພສກິດຈະກຳ & ອີເວັ້ນ',
    th: 'โพสต์กิจกรรม & อีเวนต์',
    vi: 'Bài đăng Sự kiện & Hoạt động',
    zh: '活动与动态发布',
    ko: '이벤트 및 활동 게시물',
  },
  {
    en: 'Admin & User Email Security',
    lo: 'ຄວາມປອດໄພ Email ຜູ້ບໍລິຫານ & ຜູ້ໃຊ້',
    th: 'ความปลอดภัยอีเมล แอดมิน & ผู้ใช้',
    vi: 'Bảo mật Email Admin & Người dùng',
    zh: '管理员与用户邮箱安全',
    ko: '관리자 및 사용자 이메일 보안',
  },
  {
    en: 'Email Verification & Password Recovery Center',
    lo: 'ສູນຢືນຢັນອີເມວ & ກູ້ຄືນລະຫັດຜ່ານ',
    th: 'ศูนย์ยืนยันอีเมล & กู้คืนรหัสผ่าน',
    vi: 'Trung tâm Xác minh Email & Khôi phục Mật khẩu',
    zh: '邮箱验证与密码找回中心',
    ko: '이메일 인증 및 비밀번호 복구 센터',
  },
  {
    en: 'Email Address (Verify by Email) *',
    lo: 'ທີ່ຢູ່ອີເມວ (ຢືນຢັນຜ່ານອີເມວ) *',
    th: 'ที่อยู่อีเมล (ยืนยันผ่านอีเมล) *',
    vi: 'Địa chỉ Email (Xác minh qua Email) *',
    zh: '电子邮箱地址（通过邮箱验证）*',
    ko: '이메일 주소 (이메일로 인증) *',
  },
  {
    en: 'Verify by Email & Complete Registration',
    lo: 'ຢືນຢັນຜ່ານອີເມວ & ສຳເລັດການລົງທະບຽນ',
    th: 'ยืนยันผ่านอีเมล & เสร็จสิ้นการลงทะเบียน',
    vi: 'Xác minh qua Email & Hoàn tất Đăng ký',
    zh: '通过邮箱验证并完成注册',
    ko: '이메일 인증 및 회원가입 완료',
  },
  {
    en: 'Verify by Email & Register Member →',
    lo: 'ຢືນຢັນຜ່ານອີເມວ & ລົງທະບຽນສະມາຊິກ →',
    th: 'ยืนยันผ่านอีเมล & สมัครสมาชิก →',
    vi: 'Xác minh qua Email & Đăng ký Thành viên →',
    zh: '通过邮箱验证并注册会员 →',
    ko: '이메일 인증 및 회원 가입 →',
  },
  {
    en: 'Step 1: Verify by Email Address',
    lo: 'ຂັ້ນຕອນທີ 1: ຢືນຢັນດ້ວຍທີ່ຢູ່ອີເມວ',
    th: 'ขั้นตอนที่ 1: ยืนยันด้วยที่อยู่อีเมล',
    vi: 'Bước 1: Xác minh bằng Địa chỉ Email',
    zh: '第 1 步：通过电子邮箱验证',
    ko: '1단계: 이메일 주소로 인증',
  },
  {
    en: 'Verify Email & Save New Password',
    lo: 'ຢືນຢັນອີເມວ & ບັນທຶກລະຫັດຜ່ານໃໝ່',
    th: 'ยืนยันอีเมล & บันทึกรหัสผ่านใหม่',
    vi: 'Xác minh Email & Lưu Mật khẩu Mới',
    zh: '验证邮箱并保存新密码',
    ko: '이메일 인증 및 새 비밀번호 저장',
  },
  {
    en: 'Verify by Email & Confirm Withdrawal',
    lo: 'ຢືນຢັນຜ່ານອີເມວ & ຢືນຢັນການຖອນເງິນ',
    th: 'ยืนยันผ่านอีเมล & ยืนยันการถอนเงิน',
    vi: 'Xác minh qua Email & Xác nhận Rút tiền',
    zh: '通过邮箱验证并确认提现',
    ko: '이메일 인증 및 출금 확인',
  },
  {
    en: 'Verify Email',
    lo: 'ຢືນຢັນອີເມວ',
    th: 'ยืนยันอีเมล',
    vi: 'Xác minh Email',
    zh: '验证邮箱',
    ko: '이메일 인증',
  },
  {
    en: 'Signed-In Member',
    lo: 'ສະມາຊິກທີ່ເຂົ້າສູ່ລະບົບ',
    th: 'สมาชิกที่เข้าสู่ระบบ',
    vi: 'Thành viên Đã Đăng nhập',
    zh: '当前登录会员',
    ko: '로그인된 회원',
  },
  {
    en: 'Full Panel',
    lo: 'ແຜງຄວບຄຸມເຕັມ',
    th: 'แผงควบคุมเต็ม',
    vi: 'Bảng điều khiển',
    zh: '完整面板',
    ko: '전체 패널',
  },
  {
    en: 'Singer List',
    lo: 'ລາຍຊື່ນັກຮ້ອງ',
    th: 'รายชื่อนักร้อง',
    vi: 'Danh sách Ca sĩ',
    zh: '歌手列表',
    ko: '가수 목록',
  },
  {
    en: 'Help Center',
    lo: 'ສູນຊ່ວຍເຫຼືອ',
    th: 'ศูนย์ช่วยเหลือ',
    vi: 'Trung tâm Trợ giúp',
    zh: '帮助中心',
    ko: '고객센터',
  },
  {
    en: 'Open Singer List →',
    lo: 'ເປີດລາຍຊື່ນັກຮ້ອງ →',
    th: 'เปิดรายชื่อนักร้อง →',
    vi: 'Mở Danh sách Ca sĩ →',
    zh: '打开歌手列表 →',
    ko: '가수 목록 열기 →',
  },
  {
    en: 'Open Staff List →',
    lo: 'ເປີດລາຍຊື່ທີມງານ →',
    th: 'เปิดรายชื่อทีมงาน →',
    vi: 'Mở Danh sách Nhân sự →',
    zh: '打开员工列表 →',
    ko: '스태프 목록 열기 →',
  },
  {
    en: 'Open Help Center →',
    lo: 'ເປີດສູນຊ່ວຍເຫຼືອ →',
    th: 'เปิดศูนย์ช่วยเหลือ →',
    vi: 'Mở Trung tâm Trợ giúp →',
    zh: '打开帮助中心 →',
    ko: '고객센터 열기 →',
  },
  {
    en: 'Select a Singer to Book Party Set or View Profile',
    lo: 'ເລືອກນັກຮ້ອງເພື່ອຈອງຊຸດງານລ້ຽງ ຫຼື ເບິ່ງໂປຣໄຟລ໌',
    th: 'เลือกนักร้องเพื่อจองชุดปาร์ตี้ หรือดูโปรไฟล์',
    vi: 'Chọn Ca sĩ để Đặt Gói Tiệc hoặc Xem Hồ sơ',
    zh: '选择歌手以预订派对套餐或查看个人资料',
    ko: '파티 세트를 예약하거나 프로필을 보려면 가수를 선택하세요',
  },
  {
    en: 'DMC Official Staff & 8 Positions Directory',
    lo: 'ລາຍຊື່ທີມງານ DMC & 8 ຕຳແໜ່ງທາງການ',
    th: 'ทำเนียบทีมงาน DMC & 8 ตำแหน่งทางการ',
    vi: 'Danh bạ Nhân sự Chính thức DMC & 8 Chức vụ',
    zh: 'DMC 官方员工与 8 个职位名录',
    ko: 'DMC 공식 스태프 및 8개 직책 디렉토리',
  },
  {
    en: 'Step-by-Step Video Guide, Contacts & Studio Map',
    lo: 'ວິດີໂອແນະນຳເທື່ອລະຂັ້ນຕອນ, ຂໍ້ມູນຕິດຕໍ່ & ແຜນທີ່ສະຕູດິໂອ',
    th: 'วิดีโอแนะนำทีละขั้นตอน, ข้อมูลติดต่อ & แผนที่สตูดิโอ',
    vi: 'Video Hướng dẫn Từng bước, Liên hệ & Bản đồ Phòng thu',
    zh: '分步视频指南、联系方式与录音室地图',
    ko: '단계별 비디오 가이드, 연락처 및 스튜디오 지도',
  },
  {
    en: 'How to Register',
    lo: 'ວິທີລົງທະບຽນ',
    th: 'วิธีลงทะเบียน',
    vi: 'Cách Đăng ký',
    zh: '如何注册',
    ko: '가입 방법',
  },
  {
    en: 'Video Guide',
    lo: 'ວິດີໂອແນະນຳ',
    th: 'วิดีโอแนะนำ',
    vi: 'Video Hướng dẫn',
    zh: '视频指南',
    ko: '비디오 가이드',
  },
  {
    en: 'Support & Map',
    lo: 'ຕິດຕໍ່ຊ່ວຍເຫຼືອ & ແຜນທີ່',
    th: 'ติดต่อช่วยเหลือ & แผนที่',
    vi: 'Hỗ trợ & Bản đồ',
    zh: '客服支持与地图',
    ko: '고객지원 및 지도',
  },
  {
    en: 'Admin & User SMS Security',
    lo: 'ຄວາມປອດໄພ SMS ຜູ້ບໍລິຫານ & ຜູ້ໃຊ້',
    th: 'ความปลอดภัย SMS แอดมิน & ผู้ใช้',
    vi: 'Bảo mật SMS Admin & Người dùng',
    zh: '管理员与用户短信安全',
    ko: '관리자 및 사용자 SMS 보안',
  },
  {
    en: 'Administrator Only: Post Event & Activity Slideshow',
    lo: 'ສຳລັບຜູ້ບໍລິຫານເທົ່ານັ້ນ: ໂພສກິດຈະກຳ & ສະໄລ້ໂຊອີເວັ້ນ',
    th: 'สำหรับผู้ดูแลระบบเท่านั้น: โพสต์กิจกรรม & สไลด์โชว์อีเวนต์',
    vi: 'Chỉ dành cho Quản trị viên: Đăng Sự kiện & Trình chiếu Hoạt động',
    zh: '仅限管理员：发布活动与轮播动态',
    ko: '관리자 전용: 이벤트 및 활동 슬라이드쇼 게시',
  },
  {
    en: 'Member Accounts Management (Add, Edit, Update, Delete)',
    lo: 'ຈັດການບັນຊີສະມາຊິກ (ເພີ່ມ, ແກ້ໄຂ, ອັບເດດ, ລຶບ)',
    th: 'จัดการบัญชีสมาชิก (เพิ่ม, แก้ไข, อัปเดต, ลบ)',
    vi: 'Quản lý Tài khoản Thành viên (Thêm, Sửa, Cập nhật, Xóa)',
    zh: '会员账户管理（添加、编辑、更新、删除）',
    ko: '회원 계정 관리 (추가, 수정, 업데이트, 삭제)',
  },
  {
    en: 'DMC Staff & 8 Official Positions Management (Add, Edit, Delete, Update)',
    lo: 'ຈັດການທີມງານ DMC & 8 ຕຳແໜ່ງທາງການ (ເພີ່ມ, ແກ້ໄຂ, ລຶບ, ອັບເດດ)',
    th: 'จัดการทีมงาน DMC & 8 ตำแหน่งทางการ (เพิ่ม, แก้ไข, ลบ, อัปเดต)',
    vi: 'Quản lý Nhân sự DMC & 8 Chức vụ Chính thức (Thêm, Sửa, Xóa, Cập nhật)',
    zh: 'DMC 员工与 8 个官方职位管理（添加、编辑、删除、更新）',
    ko: 'DMC 스태프 및 8개 공식 직책 관리 (추가, 수정, 삭제, 업데이트)',
  },
  {
    en: 'Product Catalog & Commission SKU Pools (CRUD)',
    lo: 'ລາຍການສິນຄ້າ & ກອງທຶນຄອມມິດຊັ່ນຕາມລະຫັດ SKU (CRUD)',
    th: 'รายการสินค้า & กองทุนคอมมิชชันตามรหัส SKU (CRUD)',
    vi: 'Danh mục Sản phẩm & Quỹ Hoa hồng SKU (CRUD)',
    zh: '产品目录与 SKU 佣金池管理 (CRUD)',
    ko: '상품 카탈로그 및 SKU 커미션 풀 (CRUD)',
  },
  {
    en: 'Orders & Logistics Management (CRUD)',
    lo: 'ຈັດການຄຳສັ່ງຊື້ & ການຂົນສົ່ງ (CRUD)',
    th: 'จัดการคำสั่งซื้อ & การขนส่ง (CRUD)',
    vi: 'Quản lý Đơn hàng & Vận chuyển (CRUD)',
    zh: '订单与物流管理 (CRUD)',
    ko: '주문 및 물류 관리 (CRUD)',
  },
  {
    en: 'Studio Song Production Projects (CRUD)',
    lo: 'ໂຄງການຜະລິດເພງໃນຫ້ອງອັດສະຕູດິໂອ (CRUD)',
    th: 'โครงการผลิตเพลงในห้องอัดสตูดิโอ (CRUD)',
    vi: 'Dự án Sản xuất Bài hát Phòng thu (CRUD)',
    zh: '录音室歌曲制作项目管理 (CRUD)',
    ko: '스튜디오 곡 제작 프로젝트 (CRUD)',
  },
  {
    en: 'Lao Banking Infrastructure & Payout Hub (Administrator Control)',
    lo: 'ລະບົບທະນາຄານລາວ & ສູນຈ່າຍເງິນ (ຄວບຄຸມໂດຍຜູ້ບໍລິຫານ)',
    th: 'ระบบธนาคารลาว & ศูนย์การจ่ายเงิน (ควบคุมโดยผู้ดูแลระบบ)',
    vi: 'Hạ tầng Ngân hàng Lào & Trung tâm Chi trả (Quản trị viên)',
    zh: '老挝银行基础设施与付款中心（管理员控制）',
    ko: '라오스 은행 인프라 및 지급 허브 (관리자 제어)',
  },
  {
    en: 'Commission Split Rules & Unallocated Reserve',
    lo: 'ກົດລະບຽບການແບ່ງຄອມມິດຊັ່ນ & ກອງທຶນສຳຮອງ',
    th: 'กฎการแบ่งคอมมิชชัน & กองทุนสำรอง',
    vi: 'Quy tắc Chia Hoa hồng & Quỹ Dự trữ',
    zh: '佣金分配规则与未分配储备金',
    ko: '커미션 분배 규칙 및 미할당 준비금',
  },
  {
    en: 'Programmer Verification Matrix (PDF Section 11)',
    lo: 'ຕາຕະລາງກວດສອບລະບົບສຳລັບນັກພັດທະນາ (PDF ໝວດທີ 11)',
    th: 'ตารางตรวจสอบระบบสำหรับนักพัฒนา (PDF หมวดที่ 11)',
    vi: 'Ma trận Kiểm thử Hệ thống (PDF Mục 11)',
    zh: '程序员验证矩阵（PDF 第 11 节）',
    ko: '프로그래머 검증 매트릭스 (PDF 섹션 11)',
  },
  {
    en: 'Administrator Report Files Center (Files 1 – 8 • Full CRUD)',
    lo: 'ສູນລວມໄຟລ໌ລາຍງານຜູ້ບໍລິຫານ (ໄຟລ໌ 1 – 8 • ຈັດການ CRUD ຄົບວົງຈອນ)',
    th: 'ศูนย์รวมไฟล์รายงานผู้ดูแลระบบ (ไฟล์ 1 – 8 • จัดการ CRUD ครบวงจร)',
    vi: 'Trung tâm Tệp Báo cáo Quản trị (Tệp 1 – 8 • CRUD Đầy đủ)',
    zh: '管理员报表文件中心（文件 1 – 8 • 完整 CRUD）',
    ko: '관리자 보고서 파일 센터 (파일 1 – 8 • 전체 CRUD)',
  },
  {
    en: 'Privacy & Policy + Membership Terms (0 LAK) — Admin CRUD',
    lo: 'ນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ + ເງື່ອນໄຂສະມາຊິກ (0 ກີບ) — Admin CRUD',
    th: 'นโยบายความเป็นส่วนตัว + เงื่อนไขสมาชิก (0 กีบ) — Admin CRUD',
    vi: 'Chính sách Bảo mật + Điều khoản Thành viên (0 LAK) — Admin CRUD',
    zh: '隐私政策 + 会员条款（0 基普）— 管理员 CRUD',
    ko: '개인정보 처리방침 + 회원 약관 (0 LAK) — 관리자 CRUD',
  },
  {
    en: '1/ Design Business Cards — DMC Xayraxa Executive & Member Card Studio',
    lo: '1/ ອອກແບບນາມບັດ — ສະຕູດິໂອນາມບັດຜູ້ບໍລິຫານ & ສະມາຊິກ DMC Xayraxa',
    th: '1/ ออกแบบนามบัตร — สตูดิโอนามบัตรผู้บริหาร & สมาชิก DMC Xayraxa',
    vi: '1/ Thiết kế Danh thiếp — Studio Danh thiếp Điều hành & Thành viên DMC',
    zh: '1/ 设计名片 — DMC Xayraxa 高管与会员名片工作室',
    ko: '1/ 명함 디자인 — DMC Xayraxa 임원 및 회원 카드 스튜디오',
  },
  {
    en: 'Download All 8 Reports in 1 Excel Workbook (.xls)',
    lo: 'ດາວໂຫຼດລາຍງານທັງໝົດ 8 ໄຟລ໌ ໃນ 1 Excel (.xls)',
    th: 'ดาวน์โหลดรายงานทั้งหมด 8 ไฟล์ ใน 1 Excel (.xls)',
    vi: 'Tải xuống Tất cả 8 Báo cáo trong 1 File Excel (.xls)',
    zh: '在 1 个 Excel 工作簿中下载全部 8 份报表 (.xls)',
    ko: '8개 보고서 전체를 1개 Excel 통합문서(.xls)로 다운로드',
  },
  {
    en: 'Products & SKUs',
    lo: 'ສິນຄ້າ & ລະຫັດສິນຄ້າ (SKUs)',
    th: 'สินค้า & รหัสสินค้า (SKUs)',
    vi: 'Sản phẩm & Mã SKU',
    zh: '产品与 SKU',
    ko: '상품 및 SKU',
  },
  {
    en: 'Orders & Shipping',
    lo: 'ຄຳສັ່ງຊື້ & ການຈັດສົ່ງ',
    th: 'คำสั่งซื้อ & การจัดส่ง',
    vi: 'Đơn hàng & Vận chuyển',
    zh: '订单与物流',
    ko: '주문 및 배송',
  },
  {
    en: 'Studio Songs & Audio',
    lo: 'ເພງສະຕູດິໂອ & ໄຟລ໌ສຽງ',
    th: 'เพลงสตูดิโอ & ไฟล์เสียง',
    vi: 'Bài hát Phòng thu & Âm thanh',
    zh: '录音室歌曲与音频',
    ko: '스튜디오 곡 및 오디오',
  },
  {
    en: 'Video & YouTube Learning',
    lo: 'ວິດີໂອ & ບົດຮຽນ YouTube',
    th: 'วิดีโอ & บทเรียน YouTube',
    vi: 'Video & Bài học YouTube',
    zh: '视频与 YouTube 课程',
    ko: '비디오 및 유튜브 학습',
  },
  {
    en: 'Academy & Branches',
    lo: 'ສະຖາບັນດົນຕີ & ສາຂາ',
    th: 'สถาบันดนตรี & สาขา',
    vi: 'Học viện & Chi nhánh',
    zh: '学院与分校',
    ko: '아카데미 및 지점',
  },
  {
    en: 'Staff & Singer Booking',
    lo: 'ທີມງານ & ການຈອງນັກຮ້ອງ',
    th: 'ทีมงาน & การจองนักร้อง',
    vi: 'Nhân sự & Đặt lịch Ca sĩ',
    zh: '员工与歌手预订',
    ko: '스태프 및 가수 예약',
  },
  {
    en: 'Country Flags & Currency',
    lo: 'ທຸງຊາດ & ສະກຸນເງິນ',
    th: 'ธงชาติ & สกุลเงิน',
    vi: 'Quốc kỳ & Tiền tệ',
    zh: '国旗与货币',
    ko: '국가 국기 및 통화',
  },
  {
    en: '12-Slide Architecture Audit',
    lo: 'ກວດສອບສະຖາປັດຕະຍະກຳ 12 ສະໄລ້',
    th: 'ตรวจสอบสถาปัตยกรรม 12 สไลด์',
    vi: 'Kiểm toán Kiến trúc 12 Slide',
    zh: '12 页架构审计',
    ko: '12슬라이드 아키텍처 감사',
  },
  {
    en: 'Dual-Review Maker / Checker Payout Authorization',
    lo: 'ການອະນຸມັດການຈ່າຍເງິນ 2 ຂັ້ນຕອນ (Maker / Checker)',
    th: 'การอนุมัติจ่ายเงิน 2 ขั้นตอน (Maker / Checker)',
    vi: 'Phê duyệt Chi trả Kép (Maker / Checker)',
    zh: '双重审核付款授权 (Maker / Checker)',
    ko: '이중 검토 출금 승인 (Maker / Checker)',
  },
  {
    en: 'Maker reviews account & KYC; Checker approves bank transfer settlement. Rejections atomically release hold back to Available.',
    lo: 'ຜູ້ກວດສອບຂັ້ນຕົ້ນ (Maker) ກວດບັນຊີ & KYC; ຜູ້ອະນຸມັດ (Checker) ຢືນຢັນການໂອນເງິນ. ກໍລະນີປະຕິເສດ ເງິນຈະກັບຄືນສູ່ຍອດຖອນໄດ້ທັນທີ.',
    th: 'ผู้ตรวจสอบ (Maker) ตรวจบัญชี & KYC; ผู้อนุมัติ (Checker) ยืนยันโอนเงิน หากปฏิเสธ ยอดเงินจะคืนกลับสู่ยอดพร้อมถอนทันที',
    vi: 'Maker kiểm tra tài khoản & KYC; Checker duyệt chuyển khoản. Nếu từ chối, tiền tạm giữ sẽ hoàn lại Số dư Khả dụng ngay lập tức.',
    zh: '制单人审核账户与实名认证；复核人批准银行转账结算。拒绝将自动释放冻结资金回可用余额。',
    ko: '검토자(Maker)가 계좌 및 KYC를 확인하고 승인자(Checker)가 은행 이체를 승인합니다. 거절 시 보류 금액이 즉시 출금 가능 잔액으로 반환됩니다.',
  },
  {
    en: 'ADMINISTRATOR APPROVED • PAID',
    lo: 'ຜູ້ບໍລິຫານອະນຸມັດແລ້ວ • ຈ່າຍແລ້ວ',
    th: 'ผู้ดูแลระบบอนุมัติแล้ว • จ่ายแล้ว',
    vi: 'QUẢN TRỊ VIÊN ĐÃ DUYỆT • ĐÃ CHI TRẢ',
    zh: '管理员已批准 • 已付款',
    ko: '관리자 승인 완료 • 지급됨',
  },
  {
    en: 'WAITING ADMINISTRATOR APPROVED (ADMIN_REVIEW)',
    lo: 'ລໍຖ້າຜູ້ບໍລິຫານອະນຸມັດ (ADMIN_REVIEW)',
    th: 'รอผู้ดูแลระบบอนุมัติ (ADMIN_REVIEW)',
    vi: 'CHỜ QUẢN TRỊ VIÊN DUYỆT (ADMIN_REVIEW)',
    zh: '等待管理员批准 (ADMIN_REVIEW)',
    ko: '관리자 승인 대기 중 (ADMIN_REVIEW)',
  },
  {
    en: 'Administrator Approve & Pay',
    lo: 'ຜູ້ບໍລິຫານອະນຸມັດ & ຈ່າຍເງິນ',
    th: 'ผู้ดูแลระบบอนุมัติ & จ่ายเงิน',
    vi: 'Quản trị viên Duyệt & Chi trả',
    zh: '管理员批准并付款',
    ko: '관리자 승인 및 지급',
  },
  {
    en: 'Maker: Approve',
    lo: 'ຜູ້ກວດສອບ: ອະນຸມັດ',
    th: 'ผู้ตรวจสอบ: อนุมัติ',
    vi: 'Maker: Duyệt',
    zh: '制单人：批准',
    ko: '검토자: 승인',
  },

  // ============================================================================
  // 3. FIVE MOBILE APP SCREENS (01 HOME, 02 STORE, 03 ACADEMY, 04 NETWORK, 05 WALLET)
  // ============================================================================
  {
    en: 'Search for music, event, academy...',
    lo: 'ຄົ້ນຫາເພງ, ກິດຈະກຳ, ສະຖາບັນດົນຕີ...',
    th: 'ค้นหาเพลง, กิจกรรม, สถาบันดนตรี...',
    vi: 'Tìm kiếm âm nhạc, sự kiện, học viện...',
    zh: '搜索音乐、活动、学院...',
    ko: '음악, 이벤트, 아카데미 검색...',
  },
  {
    en: 'Search products, music, staff, shipping, events.',
    lo: 'ຄົ້ນຫາສິນຄ້າ, ເພງ, ທີມງານ, ການຈັດສົ່ງ, ກິດຈະກຳ.',
    th: 'ค้นหาสินค้า, เพลง, ทีมงาน, การจัดส่ง, กิจกรรม.',
    vi: 'Tìm sản phẩm, âm nhạc, nhân sự, vận chuyển, sự kiện.',
    zh: '搜索产品、音乐、员工、物流、活动。',
    ko: '상품, 음악, 스태프, 배송, 이벤트 검색.',
  },
  {
    en: 'Search music, instruments, courses...',
    lo: 'ຄົ້ນຫາເພງ, ເຄື່ອງດົນຕີ, ຫຼັກສູດຮຽນ...',
    th: 'ค้นหาเพลง, เครื่องดนตรี, คอร์สเรียน...',
    vi: 'Tìm kiếm âm nhạc, nhạc cụ, khóa học...',
    zh: '搜索音乐、乐器、课程...',
    ko: '음악, 악기, 강좌 검색...',
  },
  {
    en: 'Search courses, teachers, branches...',
    lo: 'ຄົ້ນຫາຫຼັກສູດ, ຄູສອນ, ສາຂາ...',
    th: 'ค้นหาคอร์สเรียน, ครูผู้สอน, สาขา...',
    vi: 'Tìm kiếm khóa học, giáo viên, chi nhánh...',
    zh: '搜索课程、教师、分校...',
    ko: '강좌, 강사, 지점 검색...',
  },
  {
    en: 'Search name or member ID...',
    lo: 'ຄົ້ນຫາຊື່ ຫຼື ລະຫັດສະມາຊິກ...',
    th: 'ค้นหาชื่อ หรือ รหัสสมาชิก...',
    vi: 'Tìm tên hoặc mã thành viên...',
    zh: '搜索姓名或会员 ID...',
    ko: '이름 또는 회원 ID 검색...',
  },
  {
    en: 'Qualification Progress',
    lo: 'ຄວາມຄືບໜ້າຄຸນສົມບັດສະມາຊິກ',
    th: 'ความคืบหน้าคุณสมบัติสมาชิก',
    vi: 'Tiến độ Đạt chuẩn Thành viên',
    zh: '资格达标进度',
    ko: '자격 달성 진행률',
  },
  {
    en: 'Qualification Locked',
    lo: 'ລ໊ອກຄຸນສົມບັດ',
    th: 'ล็อกคุณสมบัติ',
    vi: 'Khóa Đạt chuẩn',
    zh: '资格锁定',
    ko: '자격 잠금',
  },
  {
    en: 'Qualification locked',
    lo: 'ລ໊ອກຄຸນສົມບັດ',
    th: 'ล็อกคุณสมบัติ',
    vi: 'Khóa đạt chuẩn',
    zh: '资格锁定',
    ko: '자격 잠금',
  },
  {
    en: 'Withdrawable Balance',
    lo: 'ຍອດເງິນຖອນໄດ້',
    th: 'ยอดเงินถอนได้',
    vi: 'Số dư Khả dụng',
    zh: '可提现余额',
    ko: '출금 가능 잔액',
  },
  {
    en: 'Withdrawable now',
    lo: 'ຍອດເງິນທີ່ຖອນໄດ້ຕອນນີ້',
    th: 'ยอดเงินที่ถอนได้ตอนนี้',
    vi: 'Có thể rút ngay',
    zh: '当前可提现',
    ko: '현재 출금 가능 금액',
  },
  {
    en: 'Only eligible cleared funds can be withdrawn.',
    lo: 'ສາມາດຖອນໄດ້ສະເພາະຍອດເງິນທີ່ຜ່ານການອະນຸມັດແລ້ວເທົ່ານັ້ນ.',
    th: 'ถอนได้เฉพาะยอดเงินที่ผ่านการตรวจสอบและอนุมัติแล้วเท่านั้น',
    vi: 'Chỉ có thể rút các khoản tiền đủ điều kiện đã đối soát.',
    zh: '仅可提取符合条件且已结算的资金。',
    ko: '승인 완료된 적격 자금만 출금할 수 있습니다.',
  },
  {
    en: 'Request withdrawal',
    lo: 'ຂໍຖອນເງິນ',
    th: 'ขอถอนเงิน',
    vi: 'Yêu cầu rút tiền',
    zh: '申请提现',
    ko: '출금 신청',
  },
  {
    en: 'Complete qualification',
    lo: 'ເຮັດຄຸນສົມບັດໃຫ້ຄົບ',
    th: 'ทำคุณสมบัติให้ครบ',
    vi: 'Hoàn tất đạt chuẩn',
    zh: '完成资格达标',
    ko: '자격 요건 완료하기',
  },
  {
    en: 'Active membership and verification required.',
    lo: 'ຕ້ອງເປັນສະມາຊິກສົມບູນ ແລະ ຢືນຢັນຕົວຕົນກ່ອນ.',
    th: 'ต้องมีสถานะสมาชิกสมบูรณ์และยืนยันตัวตนแล้ว',
    vi: 'Yêu cầu thành viên hoạt động và đã xác minh.',
    zh: '需要激活会员资格并完成实名验证。',
    ko: '활성 멤버십 및 본인 인증이 필요합니다.',
  },
  {
    en: 'Member Status',
    lo: 'ສະຖານະສະມາຊິກ',
    th: 'สถานะสมาชิก',
    vi: 'Trạng thái Thành viên',
    zh: '会员状态',
    ko: '회원 상태',
  },
  {
    en: 'Quick Actions',
    lo: 'ເມນູດ່ວນ',
    th: 'เมนูด่วน',
    vi: 'Thao tác Nhanh',
    zh: '快捷操作',
    ko: '빠른 메뉴',
  },
  {
    en: 'Pay 1.6M with Bank QR',
    lo: 'ຊຳລະ 1.6M ດ້ວຍ QR ທະນາຄານ',
    th: 'ชำระ 1.6M ด้วย QR ธนาคาร',
    vi: 'Thanh toán 1.6M bằng QR Ngân hàng',
    zh: '使用银行二维码支付 1.6M',
    ko: '은행 QR로 1.6M 결제',
  },
  {
    en: 'Buy Music Package',
    lo: 'ຊື້ແພັກເກັດດົນຕີ',
    th: 'ซื้อแพ็กเกจดนตรี',
    vi: 'Mua Gói Âm nhạc',
    zh: '购买音乐套餐',
    ko: '뮤직 패키지 구매',
  },
  {
    en: '1.6M Music Package',
    lo: 'ແພັກເກັດດົນຕີ 1.6 ລ້ານ',
    th: 'แพ็กเกจดนตรี 1.6 ล้าน',
    vi: 'Gói Âm nhạc 1.6M',
    zh: '160万音乐套餐',
    ko: '1.6M 뮤직 패키지',
  },
  {
    en: '1.6M Package',
    lo: 'ແພັກເກັດ 1.6M',
    th: 'แพ็กเกจ 1.6M',
    vi: 'Gói 1.6M',
    zh: '1.6M 套餐',
    ko: '1.6M 패키지',
  },
  {
    en: '1 original song + Studio production',
    lo: 'ເພງລິຂະສິດ 1 ເພງ + ອັດສຽງໃນສະຕູດິໂອ',
    th: 'เพลงลิขสิทธิ์ 1 เพลง + บันทึกเสียงในสตูดิโอ',
    vi: '1 bài hát gốc + Sản xuất phòng thu',
    zh: '1 首原创歌曲 + 录音室制作',
    ko: '오리지널 곡 1곡 + 스튜디오 제작',
  },
  {
    en: 'DMC Music Store',
    lo: 'ຮ້ານຄ້າດົນຕີ DMC',
    th: 'ร้านค้าดนตรี DMC',
    vi: 'Cửa hàng Âm nhạc DMC',
    zh: 'DMC 音乐商城',
    ko: 'DMC 뮤직 스토어',
  },
  {
    en: 'DMC Academy',
    lo: 'ສະຖາບັນດົນຕີ DMC',
    th: 'สถาบันดนตรี DMC',
    vi: 'Học viện DMC',
    zh: 'DMC 音乐学院',
    ko: 'DMC 아카데미',
  },
  {
    en: 'Find your class',
    lo: 'ຄົ້ນຫາຫ້ອງຮຽນຂອງທ່ານ',
    th: 'ค้นหาคลาสเรียนของคุณ',
    vi: 'Tìm lớp học của bạn',
    zh: '查找您的课程',
    ko: '수업 찾기',
  },
  {
    en: 'Continue learning',
    lo: 'ຮຽນຕໍ່ເນື່ອງ',
    th: 'เรียนต่อจากเดิม',
    vi: 'Tiếp tục học',
    zh: '继续学习',
    ko: '이어서 학습하기',
  },
  {
    en: 'Recommended course',
    lo: 'ຫຼັກສູດແນະນຳ',
    th: 'คอร์สเรียนแนะนำ',
    vi: 'Khóa học đề xuất',
    zh: '推荐课程',
    ko: '추천 강좌',
  },
  {
    en: 'Recommended',
    lo: 'ແນະນຳ',
    th: 'แนะนำ',
    vi: 'Đề xuất',
    zh: '推荐',
    ko: '추천',
  },
  {
    en: 'Resume lesson',
    lo: 'ຮຽນບົດຮຽນຕໍ່',
    th: 'เรียนบทเรียนต่อ',
    vi: 'Tiếp tục bài học',
    zh: '继续上课',
    ko: '수업 이어보기',
  },
  {
    en: 'View course & book',
    lo: 'ເບິ່ງຫຼັກສູດ & ຈອງຮຽນ',
    th: 'ดูคอร์ส & จองเรียน',
    vi: 'Xem khóa học & đặt lịch',
    zh: '查看课程并预订',
    ko: '강좌 보기 및 예약',
  },
  {
    en: 'My Schedule & Bookings',
    lo: 'ຕາຕະລາງຮຽນ & ການຈອງຂອງຂ້ອຍ',
    th: 'ตารางเรียน & การจองของฉัน',
    vi: 'Lịch học & Đặt chỗ của tôi',
    zh: '我的日程与预订',
    ko: '내 일정 및 예약',
  },
  {
    en: 'Progress & Certificates',
    lo: 'ຄວາມຄືບໜ້າ & ໃບຢັ້ງຢືນ',
    th: 'ความคืบหน้า & ใบรับรอง',
    vi: 'Tiến độ & Chứng chỉ',
    zh: '学习进度与证书',
    ko: '진행률 및 수료증',
  },
  {
    en: 'Delivery options',
    lo: 'ຕົວເລືອກການຈັດສົ່ງ',
    th: 'ตัวเลือกการจัดส่ง',
    vi: 'Tùy chọn giao hàng',
    zh: '配送选项',
    ko: '배송 옵션',
  },
  {
    en: 'Calculated at checkout',
    lo: 'ຄິດໄລ່ຄ່າສົ່ງໃນໜ້າຊຳລະເງິນ',
    th: 'คำนวณค่าส่งในหน้าชำระเงิน',
    vi: 'Tính phí khi thanh toán',
    zh: '结账时计算运费',
    ko: '결제 시 계산됨',
  },
  {
    en: 'My Orders & Receipts',
    lo: 'ຄຳສັ່ງຊື້ & ໃບບິນຂອງຂ້ອຍ',
    th: 'คำสั่งซื้อ & ใบเสร็จของฉัน',
    vi: 'Đơn hàng & Biên lai của tôi',
    zh: '我的订单与收据',
    ko: '내 주문 및 영수증',
  },
  {
    en: 'View details',
    lo: 'ເບິ່ງລາຍລະອຽດ',
    th: 'ดูรายละเอียด',
    vi: 'Xem chi tiết',
    zh: '查看详情',
    ko: '상세 보기',
  },
  {
    en: 'Your music community',
    lo: 'ຊຸມຊົນຄົນດົນຕີຂອງທ່ານ',
    th: 'ชุมชนคนดนตรีของคุณ',
    vi: 'Cộng đồng âm nhạc của bạn',
    zh: '您的音乐社区',
    ko: '나의 음악 커뮤니티',
  },
  {
    en: 'YOUR REFERRAL',
    lo: 'ລະຫັດແນະນຳຂອງທ່ານ',
    th: 'รหัสแนะนำของคุณ',
    vi: 'MÃ GIỚI THIỆU CỦA BẠN',
    zh: '您的推荐信息',
    ko: '나의 추천 정보',
  },
  {
    en: 'Copy referral link',
    lo: 'ກ໊ອບປີ້ລິ້ງແນະນຳ',
    th: 'คัดลอกลิงก์แนะนำ',
    vi: 'Sao chép link giới thiệu',
    zh: '复制推荐链接',
    ko: '추천 링크 복사',
  },
  {
    en: 'Copy Referral Link',
    lo: 'ກ໊ອບປີ້ລິ້ງແນະນຳ',
    th: 'คัดลอกลิงก์แนะนำ',
    vi: 'Sao chép Link Giới thiệu',
    zh: '复制推荐链接',
    ko: '추천 링크 복사',
  },
  {
    en: 'Referral QR',
    lo: 'QR ແນະນຳສະມາຊິກ',
    th: 'QR แนะนำสมาชิก',
    vi: 'Mã QR Giới thiệu',
    zh: '推荐二维码',
    ko: '추천 QR 코드',
  },
  {
    en: 'REFERRAL QR',
    lo: 'QR ແນະນຳສະມາຊິກ',
    th: 'QR แนะนำสมาชิก',
    vi: 'QR GIỚI THIỆU',
    zh: '推荐二维码',
    ko: '추천 QR',
  },
  {
    en: 'MEMBER QR',
    lo: 'QR ສະມາຊິກ',
    th: 'QR สมาชิก',
    vi: 'QR THÀNH VIÊN',
    zh: '会员二维码',
    ko: '회원 QR',
  },
  {
    en: 'Network overview',
    lo: 'ພາບລວມສາຍງານ',
    th: 'ภาพรวมสายงาน',
    vi: 'Tổng quan Mạng lưới',
    zh: '团队网络概览',
    ko: '네트워크 개요',
  },
  {
    en: 'Total members',
    lo: 'ສະມາຊິກທັງໝົດ',
    th: 'สมาชิกทั้งหมด',
    vi: 'Tổng thành viên',
    zh: '总会员数',
    ko: '전체 회원',
  },
  {
    en: 'Direct referrals and 2 further levels',
    lo: 'ສະມາຊິກແນະນຳກົງ ແລະ ອີກ 2 ຊັ້ນລຸ່ມ',
    th: 'สมาชิกแนะนำตรง และอีก 2 ชั้นถัดไป',
    vi: 'Giới thiệu trực tiếp và 2 cấp tiếp theo',
    zh: '直接推荐及下属 2 级会员',
    ko: '직접 추천 및 하위 2단계 회원',
  },
  {
    en: 'Sales rewards',
    lo: 'ລາງວັນຄ່າຄອມມິດຊັ່ນການຂາຍ',
    th: 'รางวัลค่าคอมมิชชันการขาย',
    vi: 'Thưởng doanh số bán hàng',
    zh: '销售佣金奖励',
    ko: '판매 리워드',
  },
  {
    en: 'View reward history',
    lo: 'ເບິ່ງປະຫວັດລາງວັນຄອມມິດຊັ່ນ',
    th: 'ดูประวัติรางวัลคอมมิชชัน',
    vi: 'Xem lịch sử thưởng',
    zh: '查看奖励历史',
    ko: '리워드 내역 보기',
  },
  {
    en: 'Open Wallet',
    lo: 'ເປີດກະເປົາເງິນ',
    th: 'เปิดกระเป๋าเงิน',
    vi: 'Mở Ví tiền',
    zh: '打开钱包',
    ko: '지갑 열기',
  },
  {
    en: 'Rewards follow verified sales.',
    lo: 'ລາງວັນຄອມມິດຊັ່ນຄິດໄລ່ຕາມຍອດຂາຍທີ່ຢືນຢັນແລ້ວ.',
    th: 'รางวัลคอมมิชชันคำนวณตามยอดขายที่ยืนยันแล้ว',
    vi: 'Phần thưởng được tính theo doanh số đã xác minh.',
    zh: '奖励基于已核实的销售业绩计算。',
    ko: '리워드는 검증된 판매 실적에 따라 지급됩니다.',
  },
  {
    en: 'Withdrawals require admin approval.',
    lo: 'ການຖອນເງິນຕ້ອງຜ່ານການອະນຸມັດຈາກຜູ້ບໍລິຫານ.',
    th: 'การถอนเงินต้องได้รับการอนุมัติจากผู้ดูแลระบบ',
    vi: 'Việc rút tiền cần Quản trị viên phê duyệt.',
    zh: '提现需经管理员审核批准。',
    ko: '출금은 관리자 승인이 필요합니다.',
  },
  {
    en: 'Payout account',
    lo: 'ບັນຊີຮັບເງິນໂອນ',
    th: 'บัญชีรับเงินโอน',
    vi: 'Tài khoản nhận tiền',
    zh: '收款账户',
    ko: '출금 수취 계좌',
  },
  {
    en: 'Add account',
    lo: 'ເພີ່ມບັນຊີ',
    th: 'เพิ่มบัญชี',
    vi: 'Thêm tài khoản',
    zh: '添加账户',
    ko: '계좌 추가',
  },
  {
    en: 'Recent transactions',
    lo: 'ທຸລະກຳລ่าສຸດ',
    th: 'ธุรกรรมล่าสุด',
    vi: 'Giao dịch gần đây',
    zh: '最近交易记录',
    ko: '최근 거래 내역',
  },
  {
    en: 'Withdrawals',
    lo: 'ການຖອນເງິນ',
    th: 'การถอนเงิน',
    vi: 'Rút tiền',
    zh: '提现记录',
    ko: '출금 내역',
  },
  {
    en: 'Bank accounts',
    lo: 'ບັນຊີທະນາຄານ',
    th: 'บัญชีธนาคาร',
    vi: 'Tài khoản NH',
    zh: '银行账户',
    ko: '은행 계좌',
  },
  {
    en: 'Statement',
    lo: 'ລາຍການເດີນບັນຊີ',
    th: 'รายการเดินบัญชี',
    vi: 'Sao kê',
    zh: '账单明细',
    ko: '명세서',
  },
  {
    en: 'ACTIVE LIFETIME',
    lo: 'ສະມາຊິກຕະຫຼອດຊີບ (ACTIVE)',
    th: 'สมาชิกตลอดชีพ (ACTIVE)',
    vi: 'THÀNH VIÊN TRỌN ĐỜI',
    zh: '终身正式会员',
    ko: '평생 정회원 (ACTIVE)',
  },
  {
    en: 'FREE MEMBER',
    lo: 'ສະມາຊິກຟຣີ (FREE)',
    th: 'สมาชิกฟรี (FREE)',
    vi: 'THÀNH VIÊN MIỄN PHÍ',
    zh: '免费会员',
    ko: '무료 회원 (FREE)',
  },
  {
    en: 'Build Your Music Future',
    lo: 'ສ້າງອະນາຄົດທາງດົນຕີຂອງທ່ານ',
    th: 'สร้างอนาคตทางดนตรีของคุณ',
    vi: 'Xây dựng Tương lai Âm nhạc của Bạn',
    zh: '共创您的音乐未来',
    ko: '당신의 음악 미래를 만드세요',
  },
  {
    en: '1/ USER MEMBER - REFERRAL LINK & QR',
    lo: '1/ ສະມາຊິກ - ລິ້ງແນະນຳ & QR',
    th: '1/ สมาชิก - ลิงก์แนะนำ & QR',
    vi: '1/ THÀNH VIÊN - LINK GIỚI THIỆU & QR',
    zh: '1/ 会员 - 推荐链接与二维码',
    ko: '1/ 회원 - 추천 링크 및 QR',
  },

  // ============================================================================
  // 4. PAYMENT QR MODAL & COMMON LABELS
  // ============================================================================
  {
    en: 'INSTANT QR CODE SETTLEMENT',
    lo: 'ຊຳລະເງິນດ່ວນຜ່ານ QR CODE',
    th: 'ชำระเงินด่วนผ่าน QR CODE',
    vi: 'THANH TOÁN NHANH BẰNG MÃ QR',
    zh: '二维码即时结算',
    ko: 'QR 코드 즉시 결제',
  },
  {
    en: 'Payment by QR Code — Booking Singer Party Set',
    lo: 'ຊຳລະເງິນຜ່ານ QR Code — ຈອງຊຸດປາຕີ້ນັກຮ້ອງ',
    th: 'ชำระเงินด้วย QR Code — จองชุดปาร์ตี้นักร้อง',
    vi: 'Thanh toán bằng Mã QR — Đặt Gói Tiệc Ca sĩ',
    zh: '二维码支付 — 预订歌手派对套餐',
    ko: 'QR 코드 결제 — 가수 파티 세트 예약',
  },
  {
    en: 'SCAN TO PAY TOTAL AMOUNT',
    lo: 'ສະແກນ QR ເພື່ອຊຳລະຍອດລວມທັງໝົດ',
    th: 'สแกน QR เพื่อชำระยอดรวมทั้งหมด',
    vi: 'QUÉT MÃ ĐỂ THANH TOÁN TỔNG SỐ TIỀN',
    zh: '扫码支付总金额',
    ko: '스캔하여 총 금액 결제',
  },
  {
    en: 'OFFICIAL RECEIVING BANK ACCOUNT',
    lo: 'ບັນຊີທະນາຄານຮັບເງິນຢ່າງເປັນທາງການ',
    th: 'บัญชีธนาคารรับเงินอย่างเป็นทางการ',
    vi: 'TÀI KHOẢN NGÂN HÀNG NHẬN TIỀN CHÍNH THỨC',
    zh: '官方收款银行账户',
    ko: '공식 입금 은행 계좌',
  },
  {
    en: 'BOOKING SUMMARY',
    lo: 'ສະຫຼຸບລາຍການຈອງ',
    th: 'สรุปรายการจอง',
    vi: 'TÓM TẮT ĐẶT LỊCH',
    zh: '预订摘要',
    ko: '예약 요약',
  },
  {
    en: 'Back to Edit Booking',
    lo: 'ກັບຄືນໄປແກ້ໄຂການຈອງ',
    th: 'กลับไปแก้ไขการจอง',
    vi: 'Quay lại Sửa Đặt lịch',
    zh: '返回修改预订',
    ko: '예약 수정으로 돌아가기',
  },
  {
    en: 'Copy Account',
    lo: 'ກ໊ອບປີ້ເລກບັນຊີ',
    th: 'คัดลอกเลขบัญชี',
    vi: 'Sao chép STK',
    zh: '复制账号',
    ko: '계좌번호 복사',
  },
  {
    en: 'Withdraw',
    lo: 'ຖອນເງິນ',
    th: 'ถอนเงิน',
    vi: 'Rút tiền',
    zh: '提款',
    ko: '출금',
  },
  {
    en: 'Administrator',
    lo: 'ຜູ້ບໍລິຫານລະບົບ',
    th: 'ผู้ดูแลระบบ',
    vi: 'Quản trị viên',
    zh: '系统管理员',
    ko: '관리자',
  },
  {
    en: 'Home',
    lo: 'ໜ້າຫຼັກ',
    th: 'หน้าหลัก',
    vi: 'Trang chủ',
    zh: '首页',
    ko: '홈',
  },
  {
    en: 'Store',
    lo: 'ຮ້ານຄ້າ',
    th: 'ร้านค้า',
    vi: 'Cửa hàng',
    zh: '商城',
    ko: '스토어',
  },
  {
    en: 'Academy',
    lo: 'ສະຖາບັນ',
    th: 'สถาบัน',
    vi: 'Học viện',
    zh: '学院',
    ko: '아카데미',
  },
  {
    en: 'Network',
    lo: 'ສາຍງານ',
    th: 'สายงาน',
    vi: 'Mạng lưới',
    zh: '网络',
    ko: '네트워크',
  },
  {
    en: 'Wallet',
    lo: 'ກະເປົາເງິນ',
    th: 'กระเป๋าเงิน',
    vi: 'Ví tiền',
    zh: '钱包',
    ko: '지갑',
  },

  // ============================================================================
  // 5. SIGN IN / REGISTRATION / RECOVERY PORTAL (AuthPortalModal)
  // ============================================================================
  {
    en: '♫ Official Digital Music Ecosystem • Lao PDR ♫',
    lo: '♫ ລະບົບນິເວດດົນຕີດິຈິຕອລທາງການ • ສປປ ລາວ ♫',
    th: '♫ ระบบนิเวศดนตรีดิจิทัลอย่างเป็นทางการ • สปป. ลาว ♫',
    vi: '♫ Hệ sinh thái Âm nhạc Số Chính thức • Lào ♫',
    zh: '♫ 官方数字音乐生态系统 • 老挝 ♫',
    ko: '♫ 공식 디지털 음악 생태계 • 라오스 ♫',
  },
  {
    en: 'Official Digital Music Ecosystem • Lao PDR',
    lo: 'ລະບົບນິເວດດົນຕີດິຈິຕອລທາງການ • ສປປ ລາວ',
    th: 'ระบบนิเวศดนตรีดิจิทัลอย่างเป็นทางการ • สปป. ลาว',
    vi: 'Hệ sinh thái Âm nhạc Số Chính thức • Lào',
    zh: '官方数字音乐生态系统 • 老挝',
    ko: '공식 디지털 음악 생태계 • 라오스',
  },
  {
    en: 'Member User Sign In',
    lo: 'ເຂົ້າສູ່ລະບົບສະມາຊິກຜູ້ໃຊ້',
    th: 'เข้าสู่ระบบสมาชิกผู้ใช้',
    vi: 'Đăng nhập Thành viên Người dùng',
    zh: '会员用户登录',
    ko: '회원 사용자 로그인',
  },
  {
    en: 'Administrator Sign In',
    lo: 'ເຂົ້າສູ່ລະບົບຜູ້ບໍລິຫານ',
    th: 'เข้าสู่ระบบผู้ดูแลระบบ',
    vi: 'Đăng nhập Quản trị viên',
    zh: '管理员登录',
    ko: '관리자 로그인',
  },
  {
    en: 'New Member Registration',
    lo: 'ລົງທະບຽນສະມາຊິກໃໝ່',
    th: 'ลงทะเบียนสมาชิกใหม่',
    vi: 'Đăng ký Thành viên Mới',
    zh: '新会员注册',
    ko: '신규 회원 가입',
  },
  {
    en: 'Password Recovery & Profile',
    lo: 'ກູ້ຄືນລະຫັດຜ່ານ & ໂປຣໄຟລ໌',
    th: 'กู้คืนรหัสผ่าน & โปรไฟล์',
    vi: 'Khôi phục Mật khẩu & Hồ sơ',
    zh: '找回密码与个人资料',
    ko: '비밀번호 복구 및 프로필',
  },
  {
    en: 'User Sign In',
    lo: 'ຜູ້ໃຊ້ເຂົ້າສູ່ລະບົບ',
    th: 'ผู้ใช้เข้าสู่ระบบ',
    vi: 'Người dùng Đăng nhập',
    zh: '用户登录',
    ko: '사용자 로그인',
  },
  {
    en: '1/ User Member',
    lo: '1/ ຜູ້ໃຊ້ສະມາຊິກ',
    th: '1/ สมาชิกผู้ใช้',
    vi: '1/ Thành viên',
    zh: '1/ 普通会员',
    ko: '1/ 일반 회원',
  },
  {
    en: '2/ User Singer',
    lo: '2/ ຜູ້ໃຊ້ນັກຮ້ອງ',
    th: '2/ ผู้ใช้นักร้อง',
    vi: '2/ Ca sĩ',
    zh: '2/ 歌手会员',
    ko: '2/ 가수 회원',
  },
  {
    en: '3/ User Customer (Free & Active)',
    lo: '3/ ລູກຄ້າທົ່ວໄປ (ຟຣີ & ເປີດໃຊ້)',
    th: '3/ ลูกค้าทั่วไป (ฟรี & เปิดใช้งาน)',
    vi: '3/ Khách hàng (Miễn phí & Kích hoạt)',
    zh: '3/ 客户用户（免费与正式）',
    ko: '3/ 고객 사용자 (무료 및 정회원)',
  },
  {
    en: 'Member ID or Phone (+856)',
    lo: 'ລະຫັດສະມາຊິກ ຫຼື ເບີໂທ (+856)',
    th: 'รหัสสมาชิก หรือ เบอร์โทร (+856)',
    vi: 'Mã thành viên hoặc SĐT (+856)',
    zh: '会员 ID 或手机号 (+856)',
    ko: '회원 ID 또는 전화번호 (+856)',
  },
  {
    en: 'Singer Member ID or Phone (+856)',
    lo: 'ລະຫັດສະມາຊິກນັກຮ້ອງ ຫຼື ເບີໂທ (+856)',
    th: 'รหัสสมาชิกนักร้อง หรือ เบอร์โทร (+856)',
    vi: 'Mã Ca sĩ hoặc SĐT (+856)',
    zh: '歌手会员 ID 或手机号 (+856)',
    ko: '가수 회원 ID 또는 전화번호 (+856)',
  },
  {
    en: 'Customer Member ID or Phone (+856)',
    lo: 'ລະຫັດລູກຄ້າ ຫຼື ເບີໂທ (+856)',
    th: 'รหัสลูกค้า หรือ เบอร์โทร (+856)',
    vi: 'Mã Khách hàng hoặc SĐT (+856)',
    zh: '客户 ID 或手机号 (+856)',
    ko: '고객 ID 또는 전화번호 (+856)',
  },
  {
    en: 'Free User Customer & Active Can Login ✓',
    lo: 'ລູກຄ້າຟຣີ & ລູກຄ້າເປີດໃຊ້ສາມາດເຂົ້າລະບົບໄດ້ ✓',
    th: 'ลูกค้าฟรี & ลูกค้าที่เปิดใช้งานเข้าสู่ระบบได้ ✓',
    vi: 'Khách hàng Miễn phí & Kích hoạt Đều Đăng nhập Được ✓',
    zh: '免费及正式客户均可登录 ✓',
    ko: '무료 및 정식 고객 모두 로그인 가능 ✓',
  },
  {
    en: 'Singer Member ✓',
    lo: 'ສະມາຊິກນັກຮ້ອງ ✓',
    th: 'สมาชิกนักร้อง ✓',
    vi: 'Thành viên Ca sĩ ✓',
    zh: '歌手会员 ✓',
    ko: '가수 회원 ✓',
  },
  {
    en: 'Type Member ID (e.g., DMC-LA-00404) or Phone (+856)',
    lo: 'ປ້ອນລະຫັດສະມາຊິກ (ເຊັ່ນ DMC-LA-00404) ຫຼື ເບີໂທ (+856)',
    th: 'กรอกรหัสสมาชิก (เช่น DMC-LA-00404) หรือ เบอร์โทร (+856)',
    vi: 'Nhập Mã thành viên (VD: DMC-LA-00404) hoặc SĐT (+856)',
    zh: '输入会员 ID（如 DMC-LA-00404）或手机号 (+856)',
    ko: '회원 ID (예: DMC-LA-00404) 또는 전화번호 (+856) 입력',
  },
  {
    en: 'Password / PIN',
    lo: 'ລະຫັດຜ່ານ / PIN',
    th: 'รหัสผ่าน / PIN',
    vi: 'Mật khẩu / Mã PIN',
    zh: '密码 / PIN 码',
    ko: '비밀번호 / PIN',
  },
  {
    en: 'Enter your password',
    lo: 'ປ້ອນລະຫັດຜ່ານຂອງທ່ານ',
    th: 'กรอกรหัสผ่านของคุณ',
    vi: 'Nhập mật khẩu của bạn',
    zh: '请输入您的密码',
    ko: '비밀번호를 입력하세요',
  },
  {
    en: 'Show',
    lo: 'ສະແດງ',
    th: 'แสดง',
    vi: 'Hiện',
    zh: '显示',
    ko: '보기',
  },
  {
    en: 'Hide',
    lo: 'ເຊື່ອງ',
    th: 'ซ่อน',
    vi: 'Ẩn',
    zh: '隐藏',
    ko: '숨기기',
  },
  {
    en: 'Remember me',
    lo: 'ຈື່ບັນຊີຂອງຂ້ອຍໄວ້',
    th: 'จดจำฉันไว้ในระบบ',
    vi: 'Ghi nhớ đăng nhập',
    zh: '记住我',
    ko: '로그인 상태 유지',
  },
  {
    en: 'Forgot Password?',
    lo: 'ລືມລະຫັດຜ່ານ?',
    th: 'ลืมรหัสผ่าน?',
    vi: 'Quên mật khẩu?',
    zh: '忘记密码？',
    ko: '비밀번호 찾기',
  },
  {
    en: 'Create New Account (Register)',
    lo: 'ສ້າງບັນຊີໃໝ່ (ລົງທະບຽນ)',
    th: 'สร้างบัญชีใหม่ (ลงทะเบียน)',
    vi: 'Tạo Tài khoản Mới (Đăng ký)',
    zh: '创建新账户（注册）',
    ko: '새 계정 만들기 (회원가입)',
  },
  {
    en: 'Register New Singer (0 LAK)',
    lo: 'ລົງທະບຽນນັກຮ້ອງໃໝ່ (0 ກີບ)',
    th: 'ลงทะเบียนนักร้องใหม่ (0 กีบ)',
    vi: 'Đăng ký Ca sĩ Mới (0 LAK)',
    zh: '注册新歌手（0 基普）',
    ko: '신규 가수 등록 (0 LAK)',
  },
  {
    en: 'BOOKING FORM • CALENDAR PARTY SET',
    lo: 'ແບບຟອມຈອງ • ປະຕິທິນຊຸດປາຕີ້',
    th: 'แบบฟอร์มจอง • ปฏิทินชุดปาร์ตี้',
    vi: 'PHIẾU ĐẶT LỊCH • LỊCH GÓI TIỆC',
    zh: '预订表单 • 派对套餐日历',
    ko: '예약 양식 • 파티 세트 일정',
  },
  {
    en: 'Auto-Become Affiliate',
    lo: 'ເປັນຕົວແທນອັດຕະໂນມັດ',
    th: 'เป็นตัวแทนอัตโนมัติ',
    vi: 'Tự động thành Cộng tác viên',
    zh: '自动成为推广代理',
    ko: '자동 제휴 파트너 전환',
  },
  {
    en: 'Booking singer Music Cain party set package',
    lo: 'ຈອງນັກຮ້ອງ ຊຸດປາຕີ້ດົນຕີ Music Cain',
    th: 'จองนักร้อง ชุดปาร์ตี้ดนตรี Music Cain',
    vi: 'Đặt Ca sĩ Gói Tiệc Âm Nhạc Music Cain',
    zh: '预订歌手 Music Cain 派对套餐',
    ko: '가수 Music Cain 파티 세트 패키지 예약',
  },
  {
    en: 'General Member booking singer & become Automatic Affiliate • Select Singer • Calendar Party Date • 10% Cut to Loan Wallet',
    lo: 'ສະມາຊິກທົ່ວໄປຈອງນັກຮ້ອງ & ເປັນຕົວແທນອັດຕະໂນມັດ • ເລືອກນັກຮ້ອງ • ເລືອກວັນທີຈັດງານ • ຫັກ 10% ເຂົ້າກະເປົາກູ້ຢືມ',
    th: 'สมาชิกทั่วไปจองนักร้อง & เป็นตัวแทนอัตโนมัติ • เลือกนักร้อง • เลือกวันจัดงาน • หัก 10% เข้ากระเป๋าสินเชื่อ',
    vi: 'Thành viên đặt ca sĩ & tự động thành Cộng tác viên • Chọn Ca sĩ • Chọn Ngày Tiệc • Trích 10% vào Ví Vay',
    zh: '普通会员预订歌手并自动成为推广代理 • 选择歌手 • 选择派对日期 • 10% 划入贷款钱包',
    ko: '일반 회원 가수 예약 및 자동 제휴 전환 • 가수 선택 • 파티 날짜 선택 • 10% 대출 지갑 적립',
  },
  {
    en: 'Active:',
    lo: 'ສະຖານະ:',
    th: 'สถานะ:',
    vi: 'Trạng thái:',
    zh: '当前状态:',
    ko: '현재 상태:',
  },
  {
    en: 'Signed Out',
    lo: 'ອອກຈາກລະບົບແລ້ວ',
    th: 'ออกจากระบบแล้ว',
    vi: 'Đã đăng xuất',
    zh: '已退出登录',
    ko: '로그아웃됨',
  },
  {
    en: 'Active Session: 12 Hours (Auto Sign-Out when inactive)',
    lo: 'ເຊສຊັນໃຊ້ງານ: 12 ຊົ່ວໂມງ (ອອກລະບົບອັດຕະໂນມັດເມື່ອບໍ່ມີການເຄື່ອນໄຫວ)',
    th: 'เซสชันใช้งาน: 12 ชั่วโมง (ออกจากระบบอัตโนมัติเมื่อไม่ใช้งาน)',
    vi: 'Phiên hoạt động: 12 Giờ (Tự động đăng xuất khi không hoạt động)',
    zh: '有效会话：12 小时（无操作自动退出）',
    ko: '활성 세션: 12시간 (비활성 시 자동 로그아웃)',
  },
  {
    en: 'Sign Out',
    lo: 'ອອກຈາກລະບົບ',
    th: 'ออกจากระบบ',
    vi: 'Đăng xuất',
    zh: '退出登录',
    ko: '로그아웃',
  },
  {
    en: 'Super Administrator Access',
    lo: 'ສິດການເຂົ້າເຖິງຜູ້ບໍລິຫານລະດັບສູງ',
    th: 'สิทธิ์การเข้าถึงผู้ดูแลระบบสูงสุด',
    vi: 'Quyền Truy cập Quản trị viên Cấp cao',
    zh: '超级管理员访问权限',
    ko: '최고 관리자 액세스',
  },
  {
    en: 'Auto-Fill',
    lo: 'ຕື່ມຂໍ້ມູນອັດຕະໂນມັດ',
    th: 'กรอกอัตโนมัติ',
    vi: 'Tự động điền',
    zh: '自动填充',
    ko: '자동 입력',
  },
  {
    en: 'Administrator Username / ID',
    lo: 'ຊື່ຜູ້ໃຊ້ / ລະຫັດຜູ້ບໍລິຫານ',
    th: 'ชื่อผู้ใช้ / รหัสผู้ดูแลระบบ',
    vi: 'Tên đăng nhập / ID Quản trị',
    zh: '管理员用户名 / ID',
    ko: '관리자 사용자명 / ID',
  },
  {
    en: 'Administrator Password / Master PIN',
    lo: 'ລະຫັດຜ່ານຜູ້ບໍລິຫານ / PIN ຫຼັກ',
    th: 'รหัสผ่านผู้ดูแลระบบ / PIN หลัก',
    vi: 'Mật khẩu Quản trị / Mã PIN Chính',
    zh: '管理员密码 / 主 PIN 码',
    ko: '관리자 비밀번호 / 마스터 PIN',
  },
  {
    en: 'Enter Master Password / PIN',
    lo: 'ປ້ອນລະຫັດຜ່ານຫຼັກ / PIN',
    th: 'กรอกรหัสผ่านหลัก / PIN',
    vi: 'Nhập Mật khẩu Chính / PIN',
    zh: '输入主密码 / PIN 码',
    ko: '마스터 비밀번호 / PIN 입력',
  },
  {
    en: 'Remember Administrator',
    lo: 'ຈື່ບັນຊີຜູ້ບໍລິຫານ',
    th: 'จดจำผู้ดูแลระบบ',
    vi: 'Ghi nhớ Quản trị viên',
    zh: '记住管理员',
    ko: '관리자 기억하기',
  },
  {
    en: 'Forgot Admin Password?',
    lo: 'ລືມລະຫັດຜ່ານຜູ້ບໍລິຫານ?',
    th: 'ลืมรหัสผ่านผู้ดูแลระบบ?',
    vi: 'Quên mật khẩu Quản trị?',
    zh: '忘记管理员密码？',
    ko: '관리자 비밀번호 찾기',
  },
  {
    en: 'Sign In as Admin (Post Event & Activity on Home Screen)',
    lo: 'ເຂົ້າລະບົບຜູ້ບໍລິຫານ (ໂພສອີເວັ້ນ & ກິດຈະກຳໜ້າຫຼັກ)',
    th: 'เข้าสู่ระบบแอดมิน (โพสต์อีเวนต์ & กิจกรรมหน้าหลัก)',
    vi: 'Đăng nhập Admin (Đăng Sự kiện & Hoạt động Trang chủ)',
    zh: '以管理员身份登录（在首页发布活动与动态）',
    ko: '관리자로 로그인 (홈 화면에 이벤트 및 활동 게시)',
  },
  {
    en: 'Sign In & Open Full Web Admin Portal',
    lo: 'ເຂົ້າລະບົບ & ເປີດໜ້າຜູ້ບໍລິຫານເຕັມຮູບແບບ',
    th: 'เข้าสู่ระบบ & เปิดหน้าผู้ดูแลระบบเต็มรูปแบบ',
    vi: 'Đăng nhập & Mở Cổng Quản trị Web Đầy đủ',
    zh: '登录并打开完整网页管理后台',
    ko: '로그인 및 전체 웹 관리자 포털 열기',
  },
  {
    en: 'Switch to Member Sign In →',
    lo: 'ສະຫຼັບໄປໜ້າເຂົ້າລະບົບສະມາຊິກ →',
    th: 'สลับไปหน้าเข้าสู่ระบบสมาชิก →',
    vi: 'Chuyển sang Đăng nhập Thành viên →',
    zh: '切换至会员登录 →',
    ko: '회원 로그인으로 전환 →',
  },
  {
    en: 'Back to Sign In',
    lo: 'ກັບຄືນສູ່ໜ້າເຂົ້າສູ່ລະບົບ',
    th: 'กลับไปยังหน้าเข้าสู่ระบบ',
    vi: 'Quay lại Đăng nhập',
    zh: '返回登录',
    ko: '로그인으로 돌아가기',
  },
  {
    en: 'Free Member Sign Up (Email Verified)',
    lo: 'ສະໝັກສະມາຊິກຟຣີ (ຢືນຢັນອີເມວ)',
    th: 'สมัครสมาชิกฟรี (ยืนยันอีเมล)',
    vi: 'Đăng ký Thành viên Miễn phí (Xác minh Email)',
    zh: '免费会员注册（邮箱验证）',
    ko: '무료 회원 가입 (이메일 인증)',
  },
  {
    en: 'Email Verification & Profile',
    lo: 'ຢືນຢັນອີເມວ & ໂປຣໄຟລ໌',
    th: 'ยืนยันอีเมล & โปรไฟล์',
    vi: 'Xác minh Email & Hồ sơ',
    zh: '邮箱验证与个人资料',
    ko: '이메일 인증 및 프로필',
  },
  {
    en: 'General People: Register as Singer',
    lo: 'ບຸກຄົນທົ່ວໄປ: ລົງທະບຽນເປັນນັກຮ້ອງ',
    th: 'บุคคลทั่วไป: ลงทะเบียนเป็นนักร้อง',
    vi: 'Công chúng: Đăng ký làm Ca sĩ',
    zh: '大众用户：注册成为歌手',
    ko: '일반인: 가수로 등록하기',
  },
  {
    en: 'Get Singer Wallet, Affiliate Product Links & Bank QR Withdrawals',
    lo: 'ຮັບກະເປົານັກຮ້ອງ, ລິ້ງແນະນຳສິນຄ້າ & ຖອນເງິນຜ່ານ QR ທະນາຄານ',
    th: 'รับกระเป๋านักร้อง, ลิงก์แนะนำสินค้า & ถอนเงินผ่าน QR ธนาคาร',
    vi: 'Nhận Ví Ca sĩ, Link Tiếp thị Sản phẩm & Rút tiền qua QR Ngân hàng',
    zh: '获取歌手钱包、商品推广链接及银行二维码提现',
    ko: '가수 지갑, 제휴 상품 링크 및 은행 QR 출금 이용',
  },
  {
    en: 'Register Singer →',
    lo: 'ລົງທະບຽນນັກຮ້ອງ →',
    th: 'ลงทะเบียนนักร้อง →',
    vi: 'Đăng ký Ca sĩ →',
    zh: '注册歌手 →',
    ko: '가수 등록 →',
  },
  {
    en: 'Full Name *',
    lo: 'ຊື່ ແລະ ນາມສະກຸນ *',
    th: 'ชื่อ-นามสกุล *',
    vi: 'Họ và Tên *',
    zh: '姓名 *',
    ko: '성명 *',
  },
  {
    en: 'Full Name',
    lo: 'ຊື່ ແລະ ນາມສະກຸນ',
    th: 'ชื่อ-นามสกุล',
    vi: 'Họ và Tên',
    zh: '姓名',
    ko: '성명',
  },
  {
    en: 'Lao Mobile Phone (+856) *',
    lo: 'ເບີໂທລະສັບລາວ (+856) *',
    th: 'เบอร์โทรศัพท์ลาว (+856) *',
    vi: 'Số điện thoại Lào (+856) *',
    zh: '老挝手机号 (+856) *',
    ko: '라오스 휴대폰 (+856) *',
  },
  {
    en: 'Password / PIN *',
    lo: 'ລະຫັດຜ່ານ / PIN *',
    th: 'รหัสผ่าน / PIN *',
    vi: 'Mật khẩu / PIN *',
    zh: '密码 / PIN *',
    ko: '비밀번호 / PIN *',
  },
  {
    en: 'Sponsor Member ID',
    lo: 'ລະຫັດສະມາຊິກຜູ້ແນະນຳ',
    th: 'รหัสสมาชิกผู้แนะนำ',
    vi: 'Mã Thành viên Người giới thiệu',
    zh: '推荐人会员 ID',
    ko: '추천인 회원 ID',
  },
  {
    en: 'I agree to the',
    lo: 'ຂ້ອຍຍອມຮັບ',
    th: 'ฉันยอมรับ',
    vi: 'Tôi đồng ý với',
    zh: '我同意',
    ko: '동의합니다:',
  },
  {
    en: 'DMC XAYRAXA Membership Terms (Free 0 LAK Registration).',
    lo: 'ຂໍ້ກຳນົດ ແລະ ເງື່ອນໄຂສະມາຊິກ DMC XAYRAXA (ລົງທະບຽນຟຣີ 0 ກີບ).',
    th: 'ข้อกำหนดและเงื่อนไขสมาชิก DMC XAYRAXA (สมัครฟรี 0 กีบ)',
    vi: 'Điều khoản Thành viên DMC XAYRAXA (Đăng ký Miễn phí 0 LAK).',
    zh: 'DMC XAYRAXA 会员条款（免费 0 基普注册）。',
    ko: 'DMC XAYRAXA 회원 약관 (무료 0 LAK 가입).',
  },
  {
    en: 'Read Full Terms & Conditions',
    lo: 'ອ່ານຂໍ້ກຳນົດ & ເງື່ອນໄຂສະບັບເຕັມ',
    th: 'อ่านข้อกำหนด & เงื่อนไขฉบับเต็ม',
    vi: 'Đọc Toàn bộ Điều khoản & Điều kiện',
    zh: '阅读完整条款与条件',
    ko: '전체 이용약관 읽기',
  },
  {
    en: 'Member User',
    lo: 'ບັນຊີສະມາຊິກ',
    th: 'บัญชีสมาชิก',
    vi: 'Tài khoản Thành viên',
    zh: '会员账户',
    ko: '회원 사용자',
  },
  {
    en: 'Select Member Account',
    lo: 'ເລືອກບັນຊີສະມາຊິກ',
    th: 'เลือกบัญชีสมาชิก',
    vi: 'Chọn Tài khoản Thành viên',
    zh: '选择会员账户',
    ko: '회원 계정 선택',
  },
  {
    en: 'Update Photo',
    lo: 'ອັບເດດຮູບພາບ',
    th: 'อัปเดตรูปภาพ',
    vi: 'Cập nhật Ảnh',
    zh: '更新头像',
    ko: '사진 업데이트',
  },
  {
    en: 'Phone (+856)',
    lo: 'ເບີໂທ (+856)',
    th: 'เบอร์โทร (+856)',
    vi: 'Điện thoại (+856)',
    zh: '电话 (+856)',
    ko: '전화번호 (+856)',
  },
  {
    en: 'New Password / PIN',
    lo: 'ລະຫັດຜ່ານໃໝ່ / PIN',
    th: 'รหัสผ่านใหม่ / PIN',
    vi: 'Mật khẩu Mới / PIN',
    zh: '新密码 / PIN',
    ko: '새 비밀번호 / PIN',
  },
  {
    en: 'Confirm Password',
    lo: 'ຢືນຢັນລະຫັດຜ່ານ',
    th: 'ยืนยันรหัสผ่าน',
    vi: 'Xác nhận Mật khẩu',
    zh: '确认密码',
    ko: '비밀번호 확인',
  },

  // ============================================================================
  // 6. ADMIN MEMBER CRUD, SAVE/CONFIRM & DELETE MODALS
  // ============================================================================
  {
    en: 'Add New Member',
    lo: 'ເພີ່ມສະມາຊິກໃໝ່',
    th: 'เพิ่มสมาชิกใหม่',
    vi: 'Thêm Thành viên Mới',
    zh: '添加新会员',
    ko: '신규 회원 추가',
  },
  {
    en: 'Add New Member Account',
    lo: 'ເພີ່ມບັນຊີສະມາຊິກໃໝ່',
    th: 'เพิ่มบัญชีสมาชิกใหม่',
    vi: 'Thêm Tài khoản Thành viên Mới',
    zh: '添加新会员账户',
    ko: '신규 회원 계정 추가',
  },
  {
    en: 'Confirm & Save All Changes',
    lo: 'ຢືນຢັນ & ບັນທຶກການປ່ຽນແປງທັງໝົດ',
    th: 'ยืนยัน & บันทึกการเปลี่ยนแปลงทั้งหมด',
    vi: 'Xác nhận & Lưu Tất cả Thay đổi',
    zh: '确认并保存所有更改',
    ko: '모든 변경 사항 확인 및 저장',
  },
  {
    en: 'Confirm & Save New Member',
    lo: 'ຢືນຢັນ & ບັນທຶກສະມາຊິກໃໝ່',
    th: 'ยืนยัน & บันทึกสมาชิกใหม่',
    vi: 'Xác nhận & Lưu Thành viên Mới',
    zh: '确认并保存新会员',
    ko: '신규 회원 확인 및 저장',
  },
  {
    en: 'Confirm & Save Changes',
    lo: 'ຢືນຢັນ & ບັນທຶກການປ່ຽນແປງ',
    th: 'ยืนยัน & บันทึกการเปลี่ยนแปลง',
    vi: 'Xác nhận & Lưu Thay đổi',
    zh: '确认并保存更改',
    ko: '변경 사항 확인 및 저장',
  },
  {
    en: 'Confirm Delete & Save',
    lo: 'ຢືນຢັນການລຶບ & ບັນທຶກ',
    th: 'ยืนยันการลบ & บันทึก',
    vi: 'Xác nhận Xóa & Lưu',
    zh: '确认删除并保存',
    ko: '삭제 확인 및 저장',
  },
  {
    en: 'Restore Demo Members',
    lo: 'ກູ້ຄືນສະມາຊິກຕົວຢ່າງ',
    th: 'กู้คืนสมาชิกตัวอย่าง',
    vi: 'Khôi phục Thành viên Mẫu',
    zh: '恢复演示会员',
    ko: '데모 회원 복원',
  },
  {
    en: 'Send Code to Inbox',
    lo: 'ສົ່ງລະຫັດຢືນຢັນໄປອີເມວ',
    th: 'ส่งรหัสยืนยันไปที่อีเมล',
    vi: 'Gửi Mã Xác nhận tới Email',
    zh: '发送验证码到邮箱',
    ko: '이메일로 인증 코드 전송',
  },
  {
    en: 'Confirm Inbox Code & Save New Password',
    lo: 'ຢືນຢັນລະຫັດອີເມວ & ບັນທຶກລະຫັດຜ່ານໃໝ່',
    th: 'ยืนยันรหัสอีเมล & บันทึกรหัสผ่านใหม่',
    vi: 'Xác nhận Mã Email & Lưu Mật khẩu Mới',
    zh: '确认邮箱验证码并保存新密码',
    ko: '이메일 코드 확인 및 새 비밀번호 저장',
  },
  {
    en: 'Connect Google Cloud Sync',
    lo: 'ເຊື່ອມຕໍ່ Google Cloud Sync',
    th: 'เชื่อมต่อ Google Cloud Sync',
    vi: 'Kết nối Đồng bộ Google Cloud',
    zh: '连接 Google 云端同步',
    ko: 'Google 클라우드 동기화 연결',
  },
  {
    en: 'Multi-Device Cloud Sync (Firestore)',
    lo: 'ຊິ້ງຂໍ້ມູນຫຼາຍອຸປະກອນ (Cloud)',
    th: 'ซิงค์ข้อมูลหลายอุปกรณ์ (Cloud)',
    vi: 'Đồng bộ Đa thiết bị (Cloud)',
    zh: '多设备云端同步 (Firestore)',
    ko: '멀티 기기 클라우드 동기화',
  },
  {
    en: 'Edit / Update',
    lo: 'ແກ້ໄຂ / ອັບເດດ',
    th: 'แก้ไข / อัปเดต',
    vi: 'Sửa / Cập nhật',
    zh: '编辑 / 更新',
    ko: '수정 / 업데이트',
  },
  {
    en: 'Adjust Balance',
    lo: 'ປັບຍອດເງິນ',
    th: 'ปรับยอดเงิน',
    vi: 'Điều chỉnh Số dư',
    zh: '调整余额',
    ko: '잔액 조정',
  },
  {
    en: 'Delete',
    lo: 'ລຶບ',
    th: 'ลบ',
    vi: 'Xóa',
    zh: '删除',
    ko: '삭제',
  },
  {
    en: 'Cancel',
    lo: 'ຍົກເລີກ',
    th: 'ยกเลิก',
    vi: 'Hủy',
    zh: '取消',
    ko: '취소',
  },
  {
    en: 'Save Changes',
    lo: 'ບັນທຶກການປ່ຽນແປງ',
    th: 'บันทึกการเปลี่ยนแปลง',
    vi: 'Lưu Thay đổi',
    zh: '保存更改',
    ko: '변경 사항 저장',
  },
  {
    en: 'Search name, phone, ID...',
    lo: 'ຄົ້ນຫາຊື່, ເບີໂທ, ລະຫັດ...',
    th: 'ค้นหาชื่อ, เบอร์โทร, รหัส...',
    vi: 'Tìm tên, SĐT, ID...',
    zh: '搜索姓名、电话、ID...',
    ko: '이름, 전화번호, ID 검색...',
  },
  {
    en: 'Approve Customer → User Member (1.6M)',
    lo: 'ອະນຸມັດລູກຄ້າ → ສະມາຊິກສົມບູນ (1.6M)',
    th: 'อนุมัติลูกค้า → สมาชิกสมบูรณ์ (1.6M)',
    vi: 'Duyệt Khách hàng → Thành viên (1.6M)',
    zh: '批准客户 → 正式会员 (1.6M)',
    ko: '고객 승인 → 정회원 (1.6M)',
  },
  {
    en: '✓ Approved User Member',
    lo: '✓ ອະນຸມັດເປັນສະມາຊິກສົມບູນແລ້ວ',
    th: '✓ อนุมัติเป็นสมาชิกสมบูรณ์แล้ว',
    vi: '✓ Đã duyệt Thành viên',
    zh: '✓ 已批准为正式会员',
    ko: '✓ 정회원 승인 완료',
  },
  {
    en: 'Update Staff Role',
    lo: 'ອັບເດດຕຳແໜ່ງພະນັກງານ',
    th: 'อัปเดตตำแหน่งพนักงาน',
    vi: 'Cập nhật Chức vụ Nhân sự',
    zh: '更新员工职位',
    ko: '스태프 직책 업데이트',
  },
  {
    en: '↑ Upgrade to Staff',
    lo: '↑ ເລື່ອນຂັ້ນເປັນທີມງານ Staff',
    th: '↑ เลื่อนขั้นเป็นทีมงาน Staff',
    vi: '↑ Nâng cấp lên Nhân sự Staff',
    zh: '↑ 升级为官方员工',
    ko: '↑ 스태프로 승급',
  },
  {
    en: 'Book',
    lo: 'ຈອງ',
    th: 'จอง',
    vi: 'Đặt',
    zh: '预订',
    ko: '예약',
  },
  {
    en: 'Save & Update Member',
    lo: 'ບັນທຶກ & ອັບເດດສະມາຊິກ',
    th: 'บันทึก & อัปเดตสมาชิก',
    vi: 'Lưu & Cập nhật Thành viên',
    zh: '保存并更新会员',
    ko: '회원 저장 및 업데이트',
  },
  {
    en: 'Save Profile Update',
    lo: 'ບັນທຶກການອັບເດດໂປຣໄຟລ໌',
    th: 'บันทึกการอัปเดตโปรไฟล์',
    vi: 'Lưu Cập nhật Hồ sơ',
    zh: '保存个人资料更新',
    ko: '프로필 업데이트 저장',
  },
  {
    en: 'Confirm & Save Member',
    lo: 'ຢືນຢັນ & ບັນທຶກສະມາຊິກ',
    th: 'ยืนยัน & บันทึกสมาชิก',
    vi: 'Xác nhận & Lưu Thành viên',
    zh: '确认并保存会员',
    ko: '확인 및 회원 저장',
  },
  {
    en: 'Save to Organize Tree',
    lo: 'ບັນທຶກລົງໂຄງສ້າງສາຍງານ',
    th: 'บันทึกลงผังสายงาน',
    vi: 'Lưu vào Cây Hệ thống',
    zh: '保存到组织架构树',
    ko: '조직도에 저장',
  },
  {
    en: 'Confirm Delete?',
    lo: 'ຢືນຢັນການລຶບ?',
    th: 'ยืนยันการลบ?',
    vi: 'Xác nhận Xóa?',
    zh: '确认删除？',
    ko: '삭제하시겠습니까?',
  },
  {
    en: 'Yes, Delete',
    lo: 'ແມ່ນ, ລຶບເລີຍ',
    th: 'ใช่, ลบเลย',
    vi: 'Đúng, Xóa ngay',
    zh: '确认删除',
    ko: '예, 삭제',
  },
];

// Fast case-insensitive lookup map for exact string matches (spaces normalized)
const EXACT_LOOKUP = new Map<string, TranslationEntry>();
for (const entry of PHRASE_DICTIONARY) {
  EXACT_LOOKUP.set(entry.en.replace(/\s+/g, ' ').trim().toLowerCase(), entry);
}

// Longest-first sorted phrases for safe word-boundary substring replacement (min length 6)
const SORTED_LONG_PHRASES = [...PHRASE_DICTIONARY]
  .filter((e) => e.en.length >= 6)
  .sort((a, b) => b.en.length - a.en.length);

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const REGEX_CACHE = new Map<string, RegExp>();
function getSafeBoundaryRegex(phrase: string): RegExp {
  let cached = REGEX_CACHE.get(phrase);
  if (cached) return cached;
  const startsAscii = /^[A-Za-z0-9]/.test(phrase);
  const endsAscii = /[A-Za-z0-9]$/.test(phrase);
  const pattern =
    (startsAscii ? '(?<![A-Za-z0-9])' : '') +
    escapeRegExp(phrase) +
    (endsAscii ? '(?![A-Za-z0-9])' : '');
  cached = new RegExp(pattern, 'g');
  REGEX_CACHE.set(phrase, cached);
  return cached;
}

const DYNAMIC_PATTERN_TRANSLATORS: Array<{
  regex: RegExp;
  replace: (match: RegExpMatchArray, lang: Language) => string;
}> = [
  {
    regex: /^Sign In User Member \((.+)\)$/i,
    replace: (m, lang) => {
      const prefixes: Record<Language, string> = {
        en: 'Sign In User Member',
        lo: 'ເຂົ້າສູ່ລະບົບສະມາຊິກ',
        th: 'เข้าสู่ระบบสมาชิก',
        vi: 'Đăng nhập Thành viên',
        zh: '登录普通会员',
        ko: '일반 회원 로그인',
      };
      return `${prefixes[lang]} (${m[1]})`;
    },
  },
  {
    regex: /^Sign In User Singer \((.+)\)$/i,
    replace: (m, lang) => {
      const prefixes: Record<Language, string> = {
        en: 'Sign In User Singer',
        lo: 'ເຂົ້າສູ່ລະບົບນັກຮ້ອງ',
        th: 'เข้าสู่ระบบนักร้อง',
        vi: 'Đăng nhập Ca sĩ',
        zh: '登录歌手会员',
        ko: '가수 회원 로그인',
      };
      return `${prefixes[lang]} (${m[1]})`;
    },
  },
  {
    regex: /^Sign In User Customer \((.+)\)$/i,
    replace: (m, lang) => {
      const prefixes: Record<Language, string> = {
        en: 'Sign In User Customer',
        lo: 'ເຂົ້າສູ່ລະບົບລູກຄ້າ',
        th: 'เข้าสู่ระบบลูกค้า',
        vi: 'Đăng nhập Khách hàng',
        zh: '登录客户账号',
        ko: '고객 로그인',
      };
      return `${prefixes[lang]} (${m[1]})`;
    },
  },
  {
    regex: /^Singer List \((\d+)\)$/i,
    replace: (m, lang) => {
      const prefixes: Record<Language, string> = {
        en: 'Singer List',
        lo: 'ລາຍຊື່ນັກຮ້ອງ',
        th: 'รายชื่อนักร้อง',
        vi: 'Danh sách Ca sĩ',
        zh: '歌手列表',
        ko: '가수 목록',
      };
      return `${prefixes[lang]} (${m[1]})`;
    },
  },
  {
    regex: /^Staff \((\d+)\)$/i,
    replace: (m, lang) => {
      const prefixes: Record<Language, string> = {
        en: 'Staff',
        lo: 'ທີມງານ',
        th: 'ทีมงาน',
        vi: 'Nhân sự',
        zh: '员工团队',
        ko: '스태프',
      };
      return `${prefixes[lang]} (${m[1]})`;
    },
  },
  {
    regex: /^Active Members:\s*(\d+)$/i,
    replace: (m, lang) => {
      const prefixes: Record<Language, string> = {
        en: 'Active Members',
        lo: 'ສະມາຊິກທີ່ເປີດໃຊ້ງານ',
        th: 'สมาชิกที่ใช้งานอยู่',
        vi: 'Thành viên Đang hoạt động',
        zh: '当前有效会员',
        ko: '활성 회원',
      };
      return `${prefixes[lang]}: ${m[1]}`;
    },
  },
  {
    regex: /^Deleted Permanently:\s*(\d+)$/i,
    replace: (m, lang) => {
      const prefixes: Record<Language, string> = {
        en: 'Deleted Permanently',
        lo: 'ລຶບອອກຖາວອນແລ້ວ',
        th: 'ลบออกถาวรแล้ว',
        vi: 'Đã xóa vĩnh viễn',
        zh: '已永久删除',
        ko: '영구 삭제됨',
      };
      return `${prefixes[lang]}: ${m[1]}`;
    },
  },
  {
    regex: /^Confirm Delete Member \((.+)\)$/i,
    replace: (m, lang) => {
      const prefixes: Record<Language, string> = {
        en: 'Confirm Delete Member',
        lo: 'ຢືນຢັນການລຶບສະມາຊິກ',
        th: 'ยืนยันการลบสมาชิก',
        vi: 'Xác nhận Xóa Thành viên',
        zh: '确认删除会员',
        ko: '회원 삭제 확인',
      };
      return `${prefixes[lang]} (${m[1]})`;
    },
  },
  {
    regex: /^Edit Member:\s*(.+)$/i,
    replace: (m, lang) => {
      const prefixes: Record<Language, string> = {
        en: 'Edit Member',
        lo: 'ແກ້ໄຂຂໍ້ມູນສະມາຊິກ',
        th: 'แก้ไขข้อมูลสมาชิก',
        vi: 'Chỉnh sửa Thành viên',
        zh: '编辑会员信息',
        ko: '회원 정보 수정',
      };
      return `${prefixes[lang]}: ${m[1]}`;
    },
  },
  {
    regex: /^Confirm Withdraw \((.+)\)$/i,
    replace: (m, lang) => {
      const prefixes: Record<Language, string> = {
        en: 'Confirm Withdraw',
        lo: 'ຢືນຢັນການຖອນເງິນ',
        th: 'ยืนยันการถอนเงิน',
        vi: 'Xác nhận Rút tiền',
        zh: '确认提款',
        ko: '출금 확인',
      };
      return `${prefixes[lang]} (${m[1]})`;
    },
  },
  {
    regex: /^Member Own Profile Image \((.+)\)$/i,
    replace: (m, lang) => {
      const prefixes: Record<Language, string> = {
        en: 'Member Own Profile Image',
        lo: 'ຮູບໂປຣໄຟລ໌ສ່ວນຕົວຂອງສະມາຊິກ',
        th: 'รูปโปรไฟล์ส่วนตัวของสมาชิก',
        vi: 'Ảnh Hồ sơ Cá nhân Thành viên',
        zh: '会员个人头像',
        ko: '회원 본인 프로필 사진',
      };
      return `${prefixes[lang]} (${m[1]})`;
    },
  },
];

// Store original English text and last translated text for each DOM Text node
// so switching languages is always reversible even when React updates nodeValue in place
const originalTextNodeMap = new WeakMap<Text, string>();
const lastTranslatedNodeMap = new WeakMap<Text, string>();

function translateTextContent(englishText: string, lang: Language): string {
  if (lang === 'en') {
    return englishText;
  }

  const trimmed = englishText.trim();
  if (!trimmed) {
    return englishText;
  }

  // 1. Check whitespace-normalized, case-insensitive exact match first
  const normalizedTrimmed = trimmed.replace(/\s+/g, ' ');
  const exact = EXACT_LOOKUP.get(normalizedTrimmed.toLowerCase());
  if (exact) {
    return englishText.replace(trimmed, exact[lang]);
  }

  // 2. Check dynamic pattern translators (e.g. "Sign In User Member (DMC-LA-00404)")
  for (const dyn of DYNAMIC_PATTERN_TRANSLATORS) {
    const match = normalizedTrimmed.match(dyn.regex);
    if (match) {
      return englishText.replace(trimmed, dyn.replace(match, lang));
    }
  }

  // 3. Fallback: longest-first phrase substitution with strict ASCII word boundaries
  // (never lets short words like "Book" corrupt "Booking")
  let result = englishText;
  for (const entry of SORTED_LONG_PHRASES) {
    if (result.includes(entry.en)) {
      const rx = getSafeBoundaryRegex(entry.en);
      result = result.replace(rx, entry[lang]);
    }
  }

  return result;
}

export const AutoLanguageDomTranslator: React.FC = () => {
  const { language } = useDmc();

  useEffect(() => {
    let isApplying = false;

    const applyTranslationsToRoot = (root: Node) => {
      if (isApplying) return;
      isApplying = true;

      try {
        // 1. Translate Text Nodes
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
          acceptNode(node) {
            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            const tag = parent.tagName;
            if (
              tag === 'SCRIPT' ||
              tag === 'STYLE' ||
              tag === 'NOSCRIPT' ||
              tag === 'TEXTAREA' ||
              tag === 'PRE' ||
              tag === 'CODE'
            ) {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          },
        });

        let currentNode = walker.nextNode() as Text | null;
        while (currentNode) {
          const currentVal = currentNode.nodeValue || '';
          if (currentVal.trim().length > 0) {
            const lastTranslated = lastTranslatedNodeMap.get(currentNode);
            // If node is new OR React mutated its text since our last translation pass, record new original text
            if (!originalTextNodeMap.has(currentNode) || (lastTranslated !== undefined && currentVal !== lastTranslated)) {
              originalTextNodeMap.set(currentNode, currentVal);
            }
            const origEnglish = originalTextNodeMap.get(currentNode) || currentVal;
            const translated = translateTextContent(origEnglish, language);
            lastTranslatedNodeMap.set(currentNode, translated);
            if (currentNode.nodeValue !== translated) {
              currentNode.nodeValue = translated;
            }
          }
          currentNode = walker.nextNode() as Text | null;
        }

        // 2. Translate input placeholders and button titles
        if (root instanceof HTMLElement || root instanceof Document) {
          const elements = root.querySelectorAll<HTMLElement>('[placeholder], [title]');
          elements.forEach((el) => {
            const placeholder = el.getAttribute('placeholder');
            if (placeholder) {
              const origPlaceholder = el.getAttribute('data-orig-placeholder') || placeholder;
              if (!el.hasAttribute('data-orig-placeholder')) {
                el.setAttribute('data-orig-placeholder', origPlaceholder);
              }
              const nextPlaceholder = translateTextContent(origPlaceholder, language);
              if (placeholder !== nextPlaceholder) {
                el.setAttribute('placeholder', nextPlaceholder);
              }
            }

            const title = el.getAttribute('title');
            if (title) {
              const origTitle = el.getAttribute('data-orig-title') || title;
              if (!el.hasAttribute('data-orig-title')) {
                el.setAttribute('data-orig-title', origTitle);
              }
              const nextTitle = translateTextContent(origTitle, language);
              if (title !== nextTitle) {
                el.setAttribute('title', nextTitle);
              }
            }
          });
        }
      } finally {
        isApplying = false;
      }
    };

    // Initial pass
    applyTranslationsToRoot(document.body);

    // Observe DOM updates (tab switches, modal opens, dropdowns, and React in-place text updates)
    const observer = new MutationObserver(() => {
      applyTranslationsToRoot(document.body);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [language]);

  return null;
};
