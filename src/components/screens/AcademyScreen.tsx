/**
 * DMC XAYRAXA SUPER APP - REVISION 2.6
 * SCREEN 02 - ACADEMY (Learning Center) - 6-Language Localized
 */

import React, { useState } from 'react';
import { useDmc } from '../../context/DmcContext';
import { translations, formatLak } from '../../utils/i18n';
import { DMC_STANDARD_PRICING } from '../../types/dmc';
import { DmcPricingStructureCard } from '../common/DmcPricingStructureCard';
import { BankQrPaymentModal } from '../common/BankQrPaymentModal';
import { DmcOfficialLogo } from '../common/DmcLogo';
import {
  GraduationCap,
  BookOpen,
  PlayCircle,
  CheckCircle2,
  Award,
  Music,
  Users,
  FileText,
  Clock,
  Sparkles,
  Download,
  Plus,
  Pencil,
  Trash2,
  QrCode,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  Calendar,
  Globe,
  MapPin,
  Laptop,
  Building2,
  Home,
} from 'lucide-react';
import {
  CopyrightCertificateModal,
  downloadDmcCertificateImage,
} from '../common/CopyrightCertificateModal';

interface AcademyScreenProps {
  onNavigate?: (tab: any) => void;
}

export const AcademyScreen: React.FC<AcademyScreenProps> = ({ onNavigate }) => {
  const { currentMember, language, getMemberSongs, isAdminAuthenticated, isAdminMode, adminAddOrder } = useDmc();
  const isAdmin = isAdminAuthenticated || isAdminMode;
  const t = translations[language];
  const [isCertOpen, setIsCertOpen] = useState(false);
  const [autoDownload, setAutoDownload] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccessNotice, setDownloadSuccessNotice] = useState<string | null>(null);
  const [academySearch, setAcademySearch] = useState('');
  const [learningMode, setLearningMode] = useState<'ONLINE' | 'AT_CENTER' | 'HOME_TUTOR' | 'MINI_CENTER'>('AT_CENTER');
  const [selectedProvince, setSelectedProvince] = useState('Vientiane Capital');
  const [selectedBranch, setSelectedBranch] = useState('Vientiane Branch');
  const memberSongs = getMemberSongs(currentMember.memberId);

  const handleDirectDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadDmcCertificateImage({
        memberId: currentMember.memberId,
        memberName: currentMember.name,
        isActiveLifetime: currentMember.membershipState === 'ACTIVE_LIFETIME_MEMBER',
        workTitle:
          memberSongs.length > 0
            ? memberSongs[0].title
            : 'ສຽງແຄນແດນວຽງຈັນ (Echoes of the Mekong)',
      });
      setDownloadSuccessNotice('Official DMC Copyright Certificate downloaded successfully!');
      setTimeout(() => setDownloadSuccessNotice(null), 4000);
    } catch (err) {
      console.error('Download failed', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const localizedCourses = {
    en: [
      {
        id: 'c1',
        title: 'DMC Songwriting & Vocal Preparation Masterclass',
        category: 'Music Production',
        duration: '45 mins • 6 Modules',
        instructor: 'Xay Raxa (DMC Founder)',
        progress: 80,
        description:
          'Prepare your original track for studio recording at DMC Central Studios Vientiane. Vocal technique, tempo selection, and lyric phrasing.',
        icon: Music,
      },
      {
        id: 'c2',
        title: 'Unilevel 3-Level Network Ethics & Community Growth',
        category: 'Leadership & Marketing',
        duration: '30 mins • 4 Modules',
        instructor: 'DMC Legal & Ethics Board',
        progress: 100,
        description:
          'Understanding Rev 2.6 Unilevel rules: Direct sponsor invitation, transparent 50/30/20 product splits, and zero misleading earnings claims.',
        icon: Users,
      },
      {
        id: 'c3',
        title: 'Lao PDR Music Copyright, Royalties & Digital Rights',
        category: 'Legal & Intellectual Property',
        duration: '60 mins • 8 Modules',
        instructor: 'DMC Legal Counsel',
        progress: 35,
        description:
          'Protecting your original compositions, master recording ownership, streaming platform monetization, and collective management.',
        icon: FileText,
      },
      {
        id: 'c4',
        title: 'Studio Microphone Technique & Acoustic Performance',
        category: 'Audio Engineering',
        duration: '40 mins • 5 Modules',
        instructor: 'DMC Senior Studio Engineer',
        progress: 0,
        description:
          'How to monitor in studio headphones, proximity effect, pop-filter positioning, and working with your recording producer.',
        icon: Award,
      },
    ],
    lo: [
      {
        id: 'c1',
        title: 'ຫຼັກສູດການແຕ່ງເພງ ແລະ ການກຽມສຽງຮ້ອງ DMC Masterclass',
        category: 'ການຜະລິດດົນຕີ',
        duration: '45 ນາທີ • 6 ບົດຮຽນ',
        instructor: 'ໄຊ ລາຊາ (ຜູ້ກໍ່ຕັ້ງ DMC)',
        progress: 80,
        description:
          'ກຽມພ້ອມຜົນງານເພງຕົ້ນສະບັບຂອງທ່ານສຳລັບການອັດສຽງທີ່ DMC Central Studios ວຽງຈັນ. ເທັກນິກການຮ້ອງ ແລະ ການເລືອກຈັງຫວະ.',
        icon: Music,
      },
      {
        id: 'c2',
        title: 'ຈັນຍາບັນການສ້າງສາຍງານ Unilevel 3 ຊັ້ນ ຢ່າງຖືກຕ້ອງ',
        category: 'ຄວາມເປັນຜູ້ນຳ ແລະ ການຕະຫຼາດ',
        duration: '30 ນາທີ • 4 ບົດຮຽນ',
        instructor: 'ຄະນະກຳມະການກົດໝາຍ DMC',
        progress: 100,
        description:
          'ເຂົ້າໃຈກົດລະບຽບ Rev 2.6 Unilevel: ການແນະນຳກົງ, ການແບ່ງປັນຜົນ 50/30/20 ທີ່ໂປ່ງໃສ ປາສະຈາກລະບົບໄບນະລີ.',
        icon: Users,
      },
      {
        id: 'c3',
        title: 'ກົດໝາຍລິຂະສິດເພງ ສປປ ລາວ ແລະ ລາຍຮັບຈາກຊ່ອງທາງດິຈິທັລ',
        category: 'ກົດໝາຍ ແລະ ຊັບສິນທາງປັນຍາ',
        duration: '60 ນາທີ • 8 ບົດຮຽນ',
        instructor: 'ທີ່ປຶກສາກົດໝາຍ DMC',
        progress: 35,
        description:
          'ການປົກປ້ອງຜົນງານເພງຕົ້ນສະບັບ, ກຳມະສິດສຽງບັນທຶກ Master ແລະ ການສ້າງລາຍຮັບຈາກແພລດຟອມສະຕຣີມມິງທົ່ວໂລກ.',
        icon: FileText,
      },
      {
        id: 'c4',
        title: 'ເທັກນິກການໃຊ້ໄມຫ້ອງອັດສຽງ ແລະ ການຮ້ອງເພງໃນສະຕູດິໂອ',
        category: 'ວິສະວະກຳສຽງ',
        duration: '40 ນາທີ • 5 ບົດຮຽນ',
        instructor: 'ວິສະວະກອນສຽງອາວຸໂສ DMC',
        progress: 0,
        description:
          'ວິທີຟັງສຽງຜ່ານຫູຟັງສະຕູດິໂອ, ໄລຍະຫ່າງຈາກໄມໂຄຣໂຟນ ແລະ ການເຮັດວຽກຮ່ວມກັບໂປຣດິວເຊີ.',
        icon: Award,
      },
    ],
    th: [
      {
        id: 'c1',
        title: 'คลาสเรียนการแต่งเพลงและเตรียมเสียงร้อง DMC Masterclass',
        category: 'การผลิตดนตรี',
        duration: '45 นาที • 6 บทเรียน',
        instructor: 'ไซ ราซา (ผู้ก่อตั้ง DMC)',
        progress: 80,
        description:
          'เตรียมเพลงต้นฉบับของคุณสำหรับการบันทึกเสียงที่ DMC Central Studios เวียงจันทน์ เทคนิคการร้องและการเลือกจังหวะ',
        icon: Music,
      },
      {
        id: 'c2',
        title: 'จริยธรรมการสร้างสายงาน Unilevel 3 ชั้นอย่างยั่งยืน',
        category: 'ภาวะผู้นำและการตลาด',
        duration: '30 นาที • 4 บทเรียน',
        instructor: 'คณะกรรมการกฎหมายและจริยธรรม DMC',
        progress: 100,
        description:
          'เข้าใจกฎ Rev 2.6 Unilevel: การแนะนำตรง การแบ่งส่วนแบ่ง 50/30/20 ที่โปร่งใส ปราศจากระบบไบนารี',
        icon: Users,
      },
      {
        id: 'c3',
        title: 'กฎหมายลิขสิทธิ์เพลง สปป.ลาว และรายได้จากสตรีมมิ่งดิจิทัล',
        category: 'กฎหมายและทรัพย์สินทางปัญญา',
        duration: '60 นาที • 8 บทเรียน',
        instructor: 'ฝ่ายกฎหมาย DMC',
        progress: 35,
        description:
          'การคุ้มครองผลงานเพลงต้นฉบับ สิทธิ์ความเป็นเจ้าของมาสเตอร์ และการสร้างรายได้บนแพลตฟอร์มสตรีมมิ่งทั่วโลก',
        icon: FileText,
      },
      {
        id: 'c4',
        title: 'เทคนิคการใช้ไมโครโฟนห้องอัดและการร้องในสตูดิโอ',
        category: 'วิศวกรรมเสียง',
        duration: '40 นาที • 5 บทเรียน',
        instructor: 'วิศวกรเสียงอาวุโส DMC',
        progress: 0,
        description:
          'วิธีฟังเสียงมอนิเตอร์ผ่านหูฟังสตูดิโอ ระยะห่างไมโครโฟน และการทำงานร่วมกับโปรดิวเซอร์',
        icon: Award,
      },
    ],
    vi: [
      {
        id: 'c1',
        title: 'Khóa Học Sáng Tác & Luyện Thanh Phòng Thu DMC Masterclass',
        category: 'Sản Xuất Âm Nhạc',
        duration: '45 phút • 6 Học phần',
        instructor: 'Xay Raxa (Nhà sáng lập DMC)',
        progress: 80,
        description:
          'Chuẩn bị ca khúc gốc của bạn để thu âm tại DMC Central Studios Viêng Chăn: kỹ thuật thanh nhạc và chọn nhịp độ.',
        icon: Music,
      },
      {
        id: 'c2',
        title: 'Đạo Đức Phát Triển Mạng Lưới Unilevel 3 Cấp Bền Vững',
        category: 'Lãnh Đạo & Tiếp Thị',
        duration: '30 phút • 4 Học phần',
        instructor: 'Hội đồng Pháp lý & Đạo đức DMC',
        progress: 100,
        description:
          'Hiểu rõ quy tắc Rev 2.6 Unilevel: giới thiệu trực tiếp, chia thưởng 50/30/20 minh bạch, không nhị phân.',
        icon: Users,
      },
      {
        id: 'c3',
        title: 'Luật Bản Quyền Âm Nhạc CHDCND Lào & Bản Quyền Nhạc Số',
        category: 'Pháp Lý & Sở Hữu Trí Tuệ',
        duration: '60 phút • 8 Học phần',
        instructor: 'Cố vấn Pháp lý DMC',
        progress: 35,
        description:
          'Bảo vệ tác phẩm gốc, quyền sở hữu bản thu Master và kiếm tiền trên các nền tảng nhạc số quốc tế.',
        icon: FileText,
      },
      {
        id: 'c4',
        title: 'Kỹ Thuật Micro Phòng Thu & Biểu Diễn Thanh Nhạc',
        category: 'Kỹ Thuật Âm Thanh',
        duration: '40 phút • 5 Học phần',
        instructor: 'Kỹ sư Âm thanh Cao cấp DMC',
        progress: 0,
        description:
          'Cách kiểm âm qua tai nghe phòng thu, khoảng cách micro và phối hợp hiệu quả với nhà sản xuất.',
        icon: Award,
      },
    ],
    zh: [
      {
        id: 'c1',
        title: 'DMC 词曲创作与录音棚声乐准备大师课',
        category: '音乐制作',
        duration: '45 分钟 • 6 个模块',
        instructor: 'Xay Raxa (DMC 创始人)',
        progress: 80,
        description:
          '为在万象 DMC 中央录音棚录制原创单曲做好准备：发声技巧、节奏速度选择与歌词咬字处理。',
        icon: Music,
      },
      {
        id: 'c2',
        title: 'Unilevel 三级直推合规准则与社群健康成长',
        category: '领导力与市场',
        duration: '30 分钟 • 4 个模块',
        instructor: 'DMC 法务与合规委员会',
        progress: 100,
        description:
          '深入理解 Rev 2.6 三级分润规则：直接推荐绑定、透明 50/30/20 分配比例，严禁双轨夸大宣传。',
        icon: Users,
      },
      {
        id: 'c3',
        title: '老挝音乐版权保护、版税收益与全球数字发行',
        category: '法律与知识产权',
        duration: '60 分钟 • 8 个模块',
        instructor: 'DMC 首席法律顾问',
        progress: 35,
        description: '全方位保护您的原创词曲版权、母带录音所有权以及全球流媒体平台版税变现。',
        icon: FileText,
      },
      {
        id: 'c4',
        title: '录音棚电容麦克风技巧与专业声乐录制实战',
        category: '音频工程',
        duration: '40 分钟 • 5 个模块',
        instructor: 'DMC 首席录音师',
        progress: 0,
        description: '如何使用录音棚监听耳机、控制近讲效应、防喷罩位置及与制作人高效配合。',
        icon: Award,
      },
    ],
    ko: [
      {
        id: 'c1',
        title: 'DMC 작곡 및 스튜디오 보컬 준비 마스터클래스',
        category: '음악 프로덕션',
        duration: '45분 • 6개 모듈',
        instructor: 'Xay Raxa (DMC 창립자)',
        progress: 80,
        description:
          '비엔티안 DMC 센트럴 스튜디오 녹음을 위한 오리지널 트랙 준비: 보컬 테크닉, 템포 선택 및 가사 프레이징.',
        icon: Music,
      },
      {
        id: 'c2',
        title: '유니레벨 3단계 네트워크 윤리 및 커뮤니티 성장',
        category: '리더십 & 마케팅',
        duration: '30분 • 4개 모듈',
        instructor: 'DMC 법률·윤리 위원회',
        progress: 100,
        description:
          'Rev 2.6 유니레벨 규정 이해: 직접 추천인 초대, 투명한 50/30/20 수수료 배분 및 정직한 수익 안내.',
        icon: Users,
      },
      {
        id: 'c3',
        title: '라오스 음악 저작권, 로열티 및 글로벌 디지털 권리',
        category: '법률 & 지식재산권',
        duration: '60분 • 8개 모듈',
        instructor: 'DMC 법률 고문',
        progress: 35,
        description:
          '창작곡 저작권 보호, 마스터 음원 소유권 등록 및 글로벌 스트리밍 플랫폼 수익화 가이드.',
        icon: FileText,
      },
      {
        id: 'c4',
        title: '스튜디오 마이크 테크닉 & 어쿠스틱 레코딩 실전',
        category: '오디오 엔지니어링',
        duration: '40분 • 5개 모듈',
        instructor: 'DMC 수석 레코딩 엔지니어',
        progress: 0,
        description:
          '스튜디오 헤드폰 모니터링 방법, 근접 효과 조절, 팝필터 위치 및 프로듀서와의 호흡 맞추기.',
        icon: Award,
      },
    ],
  }[language];

  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);
  const [selectedCourseForQr, setSelectedCourseForQr] = useState<{
    id: string;
    title: string;
    memberPriceLak: number;
    commissionPoolLak: number;
  } | null>(null);

  // Persisted Administrator overrides / custom courses for Academy (Add, Edit, Delete, Update)
  const [courseOverrides, setCourseOverrides] = useState<
    Record<
      string,
      {
        title?: string;
        category?: string;
        duration?: string;
        instructor?: string;
        progress?: number;
        description?: string;
        marketPriceLak?: number;
        memberPriceLak?: number;
        memberDiscountLak?: number;
        commissionPoolLak?: number;
        l1Percent?: number;
        l2Percent?: number;
        l3Percent?: number;
        deleted?: boolean;
      }
    >
  >(() => {
    try {
      const saved = localStorage.getItem('dmc_rev26_academy_overrides_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {};
  });

  const [customCourses, setCustomCourses] = useState<
    Array<{
      id: string;
      title: string;
      category: string;
      duration: string;
      instructor: string;
      progress: number;
      description: string;
      marketPriceLak?: number;
      memberPriceLak?: number;
      memberDiscountLak?: number;
      commissionPoolLak?: number;
      l1Percent?: number;
      l2Percent?: number;
      l3Percent?: number;
    }>
  >(() => {
    try {
      const saved = localStorage.getItem('dmc_rev26_academy_custom_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [courseModalMode, setCourseModalMode] = useState<'CREATE' | 'EDIT'>('CREATE');
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [courseForm, setCourseForm] = useState<{
    title: string;
    category: string;
    duration: string;
    instructor: string;
    progress: number | string;
    description: string;
    marketPriceLak: number | string;
    memberPriceLak: number | string;
    memberDiscountLak: number | string;
    commissionPoolLak: number | string;
    l1Percent: number | string;
    l2Percent: number | string;
    l3Percent: number | string;
  }>({
    title: '',
    category: 'Music Production',
    duration: '45 mins • 6 Modules',
    instructor: 'Xay Raxa (DMC Founder)',
    progress: 0,
    description: '',
    marketPriceLak: DMC_STANDARD_PRICING.marketPriceLak,
    memberPriceLak: DMC_STANDARD_PRICING.memberPriceLak,
    memberDiscountLak: DMC_STANDARD_PRICING.memberDiscountLak,
    commissionPoolLak: DMC_STANDARD_PRICING.commissionPoolLak,
    l1Percent: DMC_STANDARD_PRICING.l1Percent,
    l2Percent: DMC_STANDARD_PRICING.l2Percent,
    l3Percent: DMC_STANDARD_PRICING.l3Percent,
  });

  const displayCourses = [
    ...customCourses.map((c) => ({
      ...c,
      marketPriceLak: c.marketPriceLak ?? DMC_STANDARD_PRICING.marketPriceLak,
      memberPriceLak: c.memberPriceLak ?? DMC_STANDARD_PRICING.memberPriceLak,
      memberDiscountLak:
        c.memberDiscountLak ??
        Math.max(
          0,
          (c.marketPriceLak ?? DMC_STANDARD_PRICING.marketPriceLak) -
            (c.memberPriceLak ?? DMC_STANDARD_PRICING.memberPriceLak)
        ),
      commissionPoolLak: c.commissionPoolLak ?? DMC_STANDARD_PRICING.commissionPoolLak,
      l1Percent: c.l1Percent ?? DMC_STANDARD_PRICING.l1Percent,
      l2Percent: c.l2Percent ?? DMC_STANDARD_PRICING.l2Percent,
      l3Percent: c.l3Percent ?? DMC_STANDARD_PRICING.l3Percent,
      icon: Music,
    })),
    ...localizedCourses
      .filter((c) => !courseOverrides[c.id]?.deleted)
      .map((c) => {
        const ov = courseOverrides[c.id] || {};
        const mkt = ov.marketPriceLak ?? DMC_STANDARD_PRICING.marketPriceLak;
        const mem = ov.memberPriceLak ?? DMC_STANDARD_PRICING.memberPriceLak;
        return {
          ...c,
          ...ov,
          marketPriceLak: mkt,
          memberPriceLak: mem,
          memberDiscountLak: ov.memberDiscountLak ?? Math.max(0, mkt - mem),
          commissionPoolLak: ov.commissionPoolLak ?? DMC_STANDARD_PRICING.commissionPoolLak,
          l1Percent: ov.l1Percent ?? DMC_STANDARD_PRICING.l1Percent,
          l2Percent: ov.l2Percent ?? DMC_STANDARD_PRICING.l2Percent,
          l3Percent: ov.l3Percent ?? DMC_STANDARD_PRICING.l3Percent,
        };
      }),
  ];

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = courseForm.title.trim() || 'DMC Academy Masterclass';
    const mktPrice =
      courseForm.marketPriceLak !== '' && !isNaN(Number(courseForm.marketPriceLak))
        ? Math.max(0, Math.round(Number(courseForm.marketPriceLak)))
        : DMC_STANDARD_PRICING.marketPriceLak;
    const memPrice =
      courseForm.memberPriceLak !== '' && !isNaN(Number(courseForm.memberPriceLak))
        ? Math.max(0, Math.round(Number(courseForm.memberPriceLak)))
        : DMC_STANDARD_PRICING.memberPriceLak;
    const memDiscount =
      courseForm.memberDiscountLak !== '' && !isNaN(Number(courseForm.memberDiscountLak))
        ? Math.max(0, Math.round(Number(courseForm.memberDiscountLak)))
        : Math.max(0, mktPrice - memPrice);
    const pool =
      courseForm.commissionPoolLak !== '' && !isNaN(Number(courseForm.commissionPoolLak))
        ? Math.max(0, Math.round(Number(courseForm.commissionPoolLak)))
        : DMC_STANDARD_PRICING.commissionPoolLak;
    const l1 =
      courseForm.l1Percent !== '' && !isNaN(Number(courseForm.l1Percent))
        ? Number(courseForm.l1Percent)
        : 50;
    const l2 =
      courseForm.l2Percent !== '' && !isNaN(Number(courseForm.l2Percent))
        ? Number(courseForm.l2Percent)
        : 30;
    const l3 =
      courseForm.l3Percent !== '' && !isNaN(Number(courseForm.l3Percent))
        ? Number(courseForm.l3Percent)
        : 20;
    const prog =
      courseForm.progress !== '' && !isNaN(Number(courseForm.progress))
        ? Math.min(100, Math.max(0, Math.round(Number(courseForm.progress))))
        : 0;

    if (courseModalMode === 'EDIT' && editingCourseId) {
      if (editingCourseId.startsWith('custom-')) {
        const nextCustom = customCourses.map((item) =>
          item.id === editingCourseId
            ? {
                ...item,
                title: cleanTitle,
                category: courseForm.category.trim(),
                duration: courseForm.duration.trim(),
                instructor: courseForm.instructor.trim(),
                progress: prog,
                description: courseForm.description.trim(),
                marketPriceLak: mktPrice,
                memberPriceLak: memPrice,
                memberDiscountLak: memDiscount,
                commissionPoolLak: pool,
                l1Percent: l1,
                l2Percent: l2,
                l3Percent: l3,
              }
            : item
        );
        setCustomCourses(nextCustom);
        localStorage.setItem('dmc_rev26_academy_custom_v2', JSON.stringify(nextCustom));
      } else {
        const nextOverrides = {
          ...courseOverrides,
          [editingCourseId]: {
            title: cleanTitle,
            category: courseForm.category.trim(),
            duration: courseForm.duration.trim(),
            instructor: courseForm.instructor.trim(),
            progress: prog,
            description: courseForm.description.trim(),
            marketPriceLak: mktPrice,
            memberPriceLak: memPrice,
            memberDiscountLak: memDiscount,
            commissionPoolLak: pool,
            l1Percent: l1,
            l2Percent: l2,
            l3Percent: l3,
          },
        };
        setCourseOverrides(nextOverrides);
        localStorage.setItem('dmc_rev26_academy_overrides_v2', JSON.stringify(nextOverrides));
      }
      setDownloadSuccessNotice(`Updated Academy Course "${cleanTitle}"!`);
    } else {
      const newCourse = {
        id: `custom-${Date.now()}`,
        title: cleanTitle,
        category: courseForm.category.trim() || 'Music Production',
        duration: courseForm.duration.trim() || '45 mins • 6 Modules',
        instructor: courseForm.instructor.trim() || 'Xay Raxa (DMC Founder)',
        progress: prog,
        description:
          courseForm.description.trim() ||
          'Official DMC Xayraxa Academy training module.',
        marketPriceLak: mktPrice,
        memberPriceLak: memPrice,
        memberDiscountLak: memDiscount,
        commissionPoolLak: pool,
        l1Percent: l1,
        l2Percent: l2,
        l3Percent: l3,
      };
      const nextCustom = [newCourse, ...customCourses];
      setCustomCourses(nextCustom);
      localStorage.setItem('dmc_rev26_academy_custom_v2', JSON.stringify(nextCustom));
      setDownloadSuccessNotice(`Added new Academy Course "${cleanTitle}"!`);
    }
    setTimeout(() => setDownloadSuccessNotice(null), 4000);
    setIsCourseModalOpen(false);
  };

  const handleDeleteCourse = (courseId: string) => {
    if (displayCourses.length <= 1) return;
    if (courseId.startsWith('custom-')) {
      const nextCustom = customCourses.filter((c) => c.id !== courseId);
      setCustomCourses(nextCustom);
      localStorage.setItem('dmc_rev26_academy_custom_v2', JSON.stringify(nextCustom));
    } else {
      const nextOverrides = {
        ...courseOverrides,
        [courseId]: { ...(courseOverrides[courseId] || {}), deleted: true },
      };
      setCourseOverrides(nextOverrides);
      localStorage.setItem('dmc_rev26_academy_overrides_v2', JSON.stringify(nextOverrides));
    }
    setDownloadSuccessNotice('Deleted Academy course.');
    setTimeout(() => setDownloadSuccessNotice(null), 3500);
  };

  const selectedLearningCourse = activeCourseId
    ? displayCourses.find((c) => c.id === activeCourseId) || displayCourses[0]
    : null;

  return (
    <div className="@container pb-12 animate-in fade-in bg-white min-h-full">
      {/* =====================================================================
          03 · ACADEMY — CRIMSON TOP APP BAR + SEARCH (Matches image_b670fd1b.png)
         ===================================================================== */}
      <div className="bg-gradient-to-b from-[#8f0c1c] to-[#7a0916] px-4 pt-3 pb-5 space-y-3 text-white">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer shrink-0"
                aria-label="Back to Home"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <DmcOfficialLogo size={36} rounded="full" withGoldRing={true} />
            <div className="min-w-0">
              <div className="text-[10px] font-bold tracking-widest text-amber-200/90 uppercase leading-none">
                DMC XAYRAXA
              </div>
              <h1 className="text-base font-black tracking-tight text-white truncate mt-0.5">
                DMC Academy
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="px-2.5 py-1 rounded-full bg-white/15 border border-white/25 text-[11px] font-bold flex items-center gap-1">
              <Globe className="w-3 h-3 text-amber-300" />
              <span className="uppercase">{language}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveCourseId(displayCourses[0]?.id || 'c1');
                setActiveModuleIndex(0);
              }}
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="My Schedule"
            >
              <Calendar className="w-4 h-4 text-amber-200" />
            </button>
          </div>
        </div>

        {/* White Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={academySearch}
            onChange={(e) => setAcademySearch(e.target.value)}
            placeholder="Search courses, teachers, branches..."
            className="w-full bg-white text-slate-900 placeholder:text-slate-400 text-xs font-medium rounded-full pl-9 pr-8 py-2.5 shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          {academySearch && (
            <button
              type="button"
              onClick={() => setAcademySearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* =====================================================================
          03 · ACADEMY — WHITE ROUNDED SHEET BODY (Matches image_b670fd1b.png)
         ===================================================================== */}
      <div className="bg-white rounded-t-[28px] -mt-2 px-3.5 pt-4 pb-8 min-h-[calc(100vh-140px)] space-y-4 text-slate-900 shadow-[0_-8px_25px_rgba(0,0,0,0.18)]">
        {/* 4 Learning Mode Icon Tabs (Online, At Center, Home Tutor, Mini Center) */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'ONLINE' as const, label: 'Online', icon: Laptop },
            { id: 'AT_CENTER' as const, label: 'At Center', icon: Building2 },
            { id: 'HOME_TUTOR' as const, label: 'Home Tutor', icon: Home },
            { id: 'MINI_CENTER' as const, label: 'Mini Center', icon: Users },
          ].map((mode) => {
            const Icon = mode.icon;
            const isModeActive = learningMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setLearningMode(mode.id)}
                className={`rounded-xl py-2.5 px-1.5 flex flex-col items-center justify-center gap-1 border text-center transition-all cursor-pointer ${
                  isModeActive
                    ? 'bg-[#850818] border-[#850818] text-white shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isModeActive ? 'text-white' : 'text-slate-600'}`} />
                <span className="text-[10px] font-bold leading-tight">{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* Find Your Class Card (Province & Branch Selectors) */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900">
            <MapPin className="w-3.5 h-3.5 text-[#850818]" />
            <span>Find your class</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">
                Province
              </label>
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="w-full rounded-xl bg-white border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#850818]"
              >
                <option value="Vientiane Capital">Vientiane Capital</option>
                <option value="Luang Prabang">Luang Prabang</option>
                <option value="Champasak / Pakse">Champasak / Pakse</option>
                <option value="Savannakhet">Savannakhet</option>
              </select>
            </div>
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">
                Branch
              </label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full rounded-xl bg-white border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#850818]"
              >
                <option value="Vientiane Branch">Vientiane Branch</option>
                <option value="Dongdok Studio Branch">Dongdok Studio Branch</option>
                <option value="Sikhai Music Center">Sikhai Music Center</option>
                <option value="Luang Prabang Hub">Luang Prabang Hub</option>
              </select>
            </div>
          </div>
        </div>

        {/* Continue Learning Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900">Continue learning</h3>
            <button
              type="button"
              onClick={() => {
                setActiveCourseId(displayCourses[0]?.id || 'c1');
                setActiveModuleIndex(0);
              }}
              className="text-[11px] font-bold text-[#850818] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>My courses</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-2.5 shadow-xs flex items-center gap-3">
            <div
              onClick={() => {
                setActiveCourseId(displayCourses[0]?.id || 'c1');
                setActiveModuleIndex(0);
              }}
              className="relative w-28 h-24 rounded-xl overflow-hidden bg-slate-900 shrink-0 cursor-pointer group"
            >
              <img
                src="https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=600&q=80"
                alt="Acoustic Guitar"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-black/65 border border-white/80 flex items-center justify-center text-white">
                  <PlayCircle className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-0 space-y-1.5">
              <div>
                <div className="text-xs font-black text-slate-900 truncate">
                  Acoustic Guitar
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  Chords & Rhythm • 4 of 10 lessons completed
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-[#059669]" style={{ width: '45%' }} />
                </div>
                <span className="text-[10px] font-black text-[#059669] font-mono">45%</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveCourseId(displayCourses[0]?.id || 'c1');
                  setActiveModuleIndex(0);
                }}
                className="w-full py-1.5 rounded-lg bg-[#850818] hover:bg-red-900 text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow-xs transition-colors cursor-pointer"
              >
                <span>Resume lesson</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Recommended Course Card (Guitar Foundations) */}
        <div className="space-y-2">
          <h3 className="text-sm font-black text-slate-900">Recommended course</h3>
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="relative h-32 sm:h-36 w-full bg-slate-900 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80"
                alt="Guitar Foundations"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-black/70 border border-amber-400/50 text-amber-300 font-bold text-[9px] uppercase tracking-wider">
                DMC XAYRAXA MUSIC ACADEMY
              </span>
            </div>

            <div className="p-3 flex items-end justify-between gap-2">
              <div className="space-y-0.5">
                <div className="text-sm font-black text-slate-900">Guitar Foundations</div>
                <div className="text-[11px] text-slate-500 font-medium">
                  Choose a teacher, date & time ({selectedBranch})
                </div>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className="text-[10px] text-slate-400 line-through font-mono">
                    Public: {formatLak(DMC_STANDARD_PRICING.marketPriceLak)}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-black text-[8px] uppercase">
                    ♛ MEMBER PRICE
                  </span>
                </div>
                <div className="text-base font-black text-[#850818] font-mono">
                  {formatLak(DMC_STANDARD_PRICING.memberPriceLak)}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const first = displayCourses[0];
                  if (first) {
                    setSelectedCourseForQr({
                      id: first.id,
                      title: first.title,
                      memberPriceLak: first.memberPriceLak ?? DMC_STANDARD_PRICING.memberPriceLak,
                      commissionPoolLak:
                        first.commissionPoolLak ?? DMC_STANDARD_PRICING.commissionPoolLak,
                    });
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-[#850818] hover:bg-red-900 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-colors cursor-pointer shrink-0"
              >
                <span>View course & book</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Rows: My Schedule & Bookings + Progress & Certificates */}
        <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-slate-50/60 overflow-hidden">
          <button
            type="button"
            onClick={() => {
              setActiveCourseId(displayCourses[0]?.id || 'c1');
              setActiveModuleIndex(0);
            }}
            className="w-full px-3.5 py-2.5 flex items-center justify-between gap-2 text-left hover:bg-slate-100/80 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-red-50 text-[#850818] flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">My Schedule & Bookings</div>
                <div className="text-[10px] text-slate-500">
                  {learningMode === 'AT_CENTER' ? 'At Center' : learningMode} • {selectedBranch}
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => {
              setAutoDownload(false);
              setIsCertOpen(true);
            }}
            className="w-full px-3.5 py-2.5 flex items-center justify-between gap-2 text-left hover:bg-slate-100/80 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Progress & Certificates</div>
                <div className="text-[10px] text-slate-500">
                  Official DMC Academy & Copyright Certificate
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </button>
        </div>
      </div>

      <div>
      {/* Interactive Course Lesson Player Modal when User Selects a Course to Learn */}
      {selectedLearningCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border-2 border-amber-500/60 rounded-3xl max-w-xl w-full p-5 text-slate-100 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <PlayCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-amber-300 uppercase font-bold">
                    {selectedLearningCourse.category} • {selectedLearningCourse.duration}
                  </span>
                  <h3 className="text-sm sm:text-base font-black text-white">
                    {selectedLearningCourse.title}
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    {t.instructorLabel}: {selectedLearningCourse.instructor}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveCourseId(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/60 via-slate-950 to-slate-950 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[10px] uppercase">
                  Lesson Module #{activeModuleIndex + 1}
                </span>
                <span className="font-mono text-emerald-400 font-bold">
                  Progress: {selectedLearningCourse.progress}%
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {selectedLearningCourse.description}
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Select Lesson Module to Learn:
              </div>
              {[
                'Module 1: Studio Debut Preparation — Choosing Genre, Key & BPM',
                'Module 2: Vocal Warmup, Phrasing & Studio Microphone Distance',
                'Module 3: Recording Session Workflow at DMC Central Studio Vientiane',
                'Module 4: Master Rights, Lao PDR Copyright Law No. 38/NA & Distribution',
              ].map((modTitle, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveModuleIndex(idx)}
                  className={`w-full p-3 rounded-xl border text-left text-xs flex items-center justify-between gap-2 cursor-pointer transition-all ${
                    activeModuleIndex === idx
                      ? 'bg-amber-500/20 border-amber-400 text-white font-bold'
                      : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <PlayCircle
                      className={`w-4 h-4 shrink-0 ${
                        activeModuleIndex === idx ? 'text-amber-400' : 'text-slate-500'
                      }`}
                    />
                    <span>{modTitle}</span>
                  </span>
                  {activeModuleIndex === idx && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black shrink-0">
                      Playing
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setSelectedCourseForQr({
                    id: selectedLearningCourse.id,
                    title: selectedLearningCourse.title,
                    memberPriceLak: selectedLearningCourse.memberPriceLak,
                    commissionPoolLak: selectedLearningCourse.commissionPoolLak,
                  });
                  setActiveCourseId(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#df1c2d] hover:bg-red-700 text-white font-black text-xs flex items-center gap-1.5 shadow cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Enroll Course via Lao QR ({formatLak(selectedLearningCourse.memberPriceLak)})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCourseId(null)}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs cursor-pointer"
              >
                Done Learning
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Music Course QR Payment Modal */}
      {selectedCourseForQr && (
        <BankQrPaymentModal
          isOpen={true}
          onClose={() => setSelectedCourseForQr(null)}
          amountLak={selectedCourseForQr.memberPriceLak}
          purpose="STORE_ORDER"
          title={`Music Course: ${selectedCourseForQr.title}`}
          description={`DMC Member Price: ${formatLak(selectedCourseForQr.memberPriceLak)} (Market Price: ${formatLak(
            DMC_STANDARD_PRICING.marketPriceLak
          )} • Commission Pool: ${formatLak(selectedCourseForQr.commissionPoolLak)})`}
          onPaymentSuccess={(details) => {
            adminAddOrder({
              id: `ORD-CRS-${Date.now().toString().slice(-6)}`,
              buyerMemberId: currentMember.memberId,
              items: [
                {
                  orderLineId: `line-crs-${Date.now()}`,
                  sku: `COURSE-${selectedCourseForQr.id.toUpperCase()}`,
                  title: selectedCourseForQr.title,
                  unitPriceLak: selectedCourseForQr.memberPriceLak,
                  quantity: 1,
                  totalLak: selectedCourseForQr.memberPriceLak,
                  commissionPoolLak: selectedCourseForQr.commissionPoolLak,
                  itemType: 'SERVICE',
                },
              ],
              subtotalLak: selectedCourseForQr.memberPriceLak,
              shippingFeeLak: 0,
              totalLak: selectedCourseForQr.memberPriceLak,
              paymentMethod: 'BCEL_ONE',
              paymentReference: details.reference,
              status: 'DELIVERED',
              createdAt: new Date().toISOString(),
              paidAt: new Date().toISOString(),
              deliveredAt: new Date().toISOString(),
            });
            setDownloadSuccessNotice(
              `Enrolled in "${selectedCourseForQr.title}" at DMC Member Price (${formatLak(
                selectedCourseForQr.memberPriceLak
              )})! Commission Pool (${formatLak(
                selectedCourseForQr.commissionPoolLak
              )}) distributed (L1: 50% • L2: 30% • L3: 20%).`
            );
            setTimeout(() => setDownloadSuccessNotice(null), 5000);
            setSelectedCourseForQr(null);
          }}
        />
      )}

      <CopyrightCertificateModal
        isOpen={isCertOpen}
        onClose={() => {
          setIsCertOpen(false);
          setAutoDownload(false);
        }}
        memberId={currentMember.memberId}
        memberName={currentMember.name}
        isActiveLifetime={currentMember.membershipState === 'ACTIVE_LIFETIME_MEMBER'}
        songs={memberSongs}
        autoDownloadOnOpen={autoDownload}
      />

      {/* Administrator Add / Edit / Update / Delete Academy Course Modal */}
      {isAdmin && isCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border-2 border-amber-500/60 rounded-3xl max-w-lg w-full p-5 text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">
                    {courseModalMode === 'EDIT'
                      ? 'Edit / Update Academy Course'
                      : 'Add New Academy Course'}
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Administrator Course Management
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCourseModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  placeholder="e.g. Studio Vocal & Acoustic Guitar Masterclass"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category *</label>
                  <input
                    type="text"
                    required
                    value={courseForm.category}
                    onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Duration & Modules</label>
                  <input
                    type="text"
                    value={courseForm.duration}
                    onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Instructor</label>
                  <input
                    type="text"
                    value={courseForm.instructor}
                    onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Completion Progress (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step="any"
                    value={courseForm.progress}
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        progress: e.target.value === '' ? '' : Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-amber-300 font-mono font-bold focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Market Price (LAK) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={courseForm.marketPriceLak}
                    onChange={(e) => {
                      const val = e.target.value;
                      const mktNum = Number(val) || 0;
                      const memNum = Number(courseForm.memberPriceLak) || 0;
                      setCourseForm({
                        ...courseForm,
                        marketPriceLak: val === '' ? '' : Number(val),
                        memberDiscountLak: Math.max(0, mktNum - memNum),
                      });
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-slate-200 font-mono font-bold focus:border-amber-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-amber-300 font-bold mb-1">
                    DMC Member Price (LAK) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={courseForm.memberPriceLak}
                    onChange={(e) => {
                      const val = e.target.value;
                      const memNum = Number(val) || 0;
                      const mktNum = Number(courseForm.marketPriceLak) || 0;
                      setCourseForm({
                        ...courseForm,
                        memberPriceLak: val === '' ? '' : Number(val),
                        memberDiscountLak: Math.max(0, mktNum - memNum),
                      });
                    }}
                    className="w-full bg-slate-950 border-2 border-amber-500/60 rounded-xl p-2 text-amber-300 font-mono font-black focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-emerald-300 font-bold mb-1">
                    Member Discount (LAK) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={courseForm.memberDiscountLak}
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        memberDiscountLak: e.target.value === '' ? '' : Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-950 border border-emerald-500/50 rounded-xl p-2 text-emerald-400 font-mono font-bold focus:border-emerald-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-amber-300 font-bold mb-1">
                    Commission Pool = 100% (LAK) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={courseForm.commissionPoolLak}
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        commissionPoolLak: e.target.value === '' ? '' : Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-950 border border-amber-500/50 rounded-xl p-2 text-amber-300 font-mono font-bold focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              {/* Commission Distribution L1 / L2 / L3 (%) Input by Type Number */}
              <div className="p-2.5 rounded-xl bg-slate-950 border border-amber-500/30 space-y-1.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-amber-300">
                    Commission Distribution (From {formatLak(Number(courseForm.commissionPoolLak) || 0)} Pool):
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {Number(courseForm.l1Percent) || 0}% + {Number(courseForm.l2Percent) || 0}% +{' '}
                    {Number(courseForm.l3Percent) || 0}% ={' '}
                    {(Number(courseForm.l1Percent) || 0) +
                      (Number(courseForm.l2Percent) || 0) +
                      (Number(courseForm.l3Percent) || 0)}
                    %
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[9px] text-amber-300 font-bold mb-0.5">
                      L1 (%) •{' '}
                      {formatLak(
                        Math.floor(
                          ((Number(courseForm.commissionPoolLak) || 0) *
                            (Number(courseForm.l1Percent) || 0)) /
                            100
                        )
                      )}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="any"
                      value={courseForm.l1Percent}
                      onChange={(e) =>
                        setCourseForm({
                          ...courseForm,
                          l1Percent: e.target.value === '' ? '' : Number(e.target.value),
                        })
                      }
                      className="w-full bg-slate-900 border border-amber-500/40 rounded-lg p-1.5 text-center text-white font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-sky-300 font-bold mb-0.5">
                      L2 (%) •{' '}
                      {formatLak(
                        Math.floor(
                          ((Number(courseForm.commissionPoolLak) || 0) *
                            (Number(courseForm.l2Percent) || 0)) /
                            100
                        )
                      )}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="any"
                      value={courseForm.l2Percent}
                      onChange={(e) =>
                        setCourseForm({
                          ...courseForm,
                          l2Percent: e.target.value === '' ? '' : Number(e.target.value),
                        })
                      }
                      className="w-full bg-slate-900 border border-sky-500/40 rounded-lg p-1.5 text-center text-white font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-emerald-300 font-bold mb-0.5">
                      L3 (%) •{' '}
                      {formatLak(
                        Math.floor(
                          ((Number(courseForm.commissionPoolLak) || 0) *
                            (Number(courseForm.l3Percent) || 0)) /
                            100
                        )
                      )}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="any"
                      value={courseForm.l3Percent}
                      onChange={(e) =>
                        setCourseForm({
                          ...courseForm,
                          l3Percent: e.target.value === '' ? '' : Number(e.target.value),
                        })
                      }
                      className="w-full bg-slate-900 border border-emerald-500/40 rounded-lg p-1.5 text-center text-white font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Course Description *
                </label>
                <textarea
                  rows={2}
                  required
                  value={courseForm.description}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, description: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-between gap-2 pt-2">
                {courseModalMode === 'EDIT' && editingCourseId && displayCourses.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      handleDeleteCourse(editingCourseId);
                      setIsCourseModalOpen(false);
                    }}
                    className="px-3.5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setIsCourseModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs cursor-pointer"
                  >
                    {courseModalMode === 'EDIT' ? 'Update Course' : 'Save New Course'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
