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
} from 'lucide-react';
import {
  CopyrightCertificateModal,
  downloadDmcCertificateImage,
} from '../common/CopyrightCertificateModal';

export const AcademyScreen: React.FC = () => {
  const { currentMember, language, getMemberSongs, isAdminAuthenticated, isAdminMode, adminAddOrder } = useDmc();
  const isAdmin = isAdminAuthenticated || isAdminMode;
  const t = translations[language];
  const [isCertOpen, setIsCertOpen] = useState(false);
  const [autoDownload, setAutoDownload] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccessNotice, setDownloadSuccessNotice] = useState<string | null>(null);
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

  const [, setActiveCourseId] = useState<string | null>(null);
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

  return (
    <div className="@container space-y-6 pb-12 animate-in fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-amber-400" />
            <span>{t.academyTitle}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">{t.academySubtitle}</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {isAdmin && (
            <button
              type="button"
              onClick={() => {
                setCourseModalMode('CREATE');
                setEditingCourseId(null);
                setCourseForm({
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
                setIsCourseModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-300 text-xs font-bold shadow-sm transition-all cursor-pointer"
              title="Administrator: Add New Academy Course"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Course</span>
            </button>
          )}

          {/* Main "Certification Pathway" Pill Button */}
          <button
            onClick={() => {
              setAutoDownload(false);
              setIsCertOpen(true);
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-semibold shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="View Official DMC Copyright Certificate"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>{t.certificationPathway}</span>
          </button>

          {/* Direct 1-Click "Download Certificate" Button */}
          <button
            onClick={handleDirectDownload}
            disabled={isDownloading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-60"
            title="Download Official DMC Copyright Certificate (PNG)"
          >
            {isDownloading ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>{t.downloadCertificate}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Download Success Toast Notice */}
      {downloadSuccessNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{downloadSuccessNotice}</span>
          </div>
          <button
            onClick={() => {
              setAutoDownload(false);
              setIsCertOpen(true);
            }}
            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 text-[11px] font-bold underline cursor-pointer"
          >
            {t.certificationPathway}
          </button>
        </div>
      )}

      {/* Featured Lesson Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 border border-amber-500/30 flex flex-col @2xl:flex-row items-start @2xl:items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1.5 max-w-xl">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500 text-slate-950">
            {t.currentModuleInProgress}
          </span>
          <h3 className="text-base font-bold text-white">{t.featuredLessonTitle}</h3>
          <p className="text-xs text-slate-300 leading-relaxed">{t.featuredLessonDesc}</p>
        </div>
        <button
          onClick={() => setActiveCourseId('c1')}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-colors shrink-0 shadow cursor-pointer"
        >
          <PlayCircle className="w-4 h-4" />
          <span>{t.resumeLessonBtn}</span>
        </button>
      </div>

      {/* Official DMC Music Course Pricing Structure */}
      <DmcPricingStructureCard
        title="DMC Music Course Pricing – Official Member Discount & Commission Pool"
        onSavePricing={(payload) => {
          const nextOverrides = { ...courseOverrides };
          localizedCourses.forEach((lc) => {
            nextOverrides[lc.id] = {
              ...(nextOverrides[lc.id] || {}),
              marketPriceLak: payload.marketPriceLak,
              memberPriceLak: payload.memberPriceLak,
              memberDiscountLak: payload.memberDiscountLak,
              commissionPoolLak: payload.commissionPoolLak,
              l1Percent: payload.l1Percent,
              l2Percent: payload.l2Percent,
              l3Percent: payload.l3Percent,
            };
          });
          setCourseOverrides(nextOverrides);
          localStorage.setItem('dmc_rev26_academy_overrides_v2', JSON.stringify(nextOverrides));

          const nextCustom = customCourses.map((cc) => ({
            ...cc,
            marketPriceLak: payload.marketPriceLak,
            memberPriceLak: payload.memberPriceLak,
            memberDiscountLak: payload.memberDiscountLak,
            commissionPoolLak: payload.commissionPoolLak,
            l1Percent: payload.l1Percent,
            l2Percent: payload.l2Percent,
            l3Percent: payload.l3Percent,
          }));
          setCustomCourses(nextCustom);
          localStorage.setItem('dmc_rev26_academy_custom_v2', JSON.stringify(nextCustom));
          setDownloadSuccessNotice(
            `Updated DMC Music Course Pricing: Market ${formatLak(
              payload.marketPriceLak
            )} • Member ${formatLak(payload.memberPriceLak)} • Discount ${formatLak(
              payload.memberDiscountLak
            )} • Pool ${formatLak(payload.commissionPoolLak)}`
          );
          setTimeout(() => setDownloadSuccessNotice(null), 5000);
        }}
      />

      {/* Course List */}
      <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-4">
        {displayCourses.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.id}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-4 shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                      {c.category}
                    </span>
                    {isAdmin && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setCourseModalMode('EDIT');
                            setEditingCourseId(c.id);
                            setCourseForm({
                              title: c.title,
                              category: c.category,
                              duration: c.duration,
                              instructor: c.instructor,
                              progress: c.progress,
                              description: c.description,
                              marketPriceLak: c.marketPriceLak,
                              memberPriceLak: c.memberPriceLak,
                              memberDiscountLak: c.memberDiscountLak,
                              commissionPoolLak: c.commissionPoolLak,
                              l1Percent: c.l1Percent,
                              l2Percent: c.l2Percent,
                              l3Percent: c.l3Percent,
                            });
                            setIsCourseModalOpen(true);
                          }}
                          className="px-2 py-0.5 rounded bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                          title="Administrator: Edit / Update Course"
                        >
                          <Pencil className="w-2.5 h-2.5" />
                          <span>Edit</span>
                        </button>
                        {displayCourses.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteCourse(c.id)}
                            className="p-1 rounded bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 cursor-pointer"
                            title="Administrator: Delete Course"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-white">{c.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{c.description}</p>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{c.duration}</span>
                  </span>
                  <span>•</span>
                  <span>
                    {t.instructorLabel}: {c.instructor}
                  </span>
                </div>

                {/* DMC Music Course Pricing & Commission Breakdown */}
                <DmcPricingStructureCard
                  marketPriceLak={c.marketPriceLak}
                  memberPriceLak={c.memberPriceLak}
                  memberDiscountLak={c.memberDiscountLak}
                  commissionPoolLak={c.commissionPoolLak}
                  l1Percent={c.l1Percent}
                  l2Percent={c.l2Percent}
                  l3Percent={c.l3Percent}
                  compact={true}
                  onSavePricing={(payload) => {
                    if (c.id.startsWith('custom-')) {
                      const nextCustom = customCourses.map((item) =>
                        item.id === c.id
                          ? {
                              ...item,
                              marketPriceLak: payload.marketPriceLak,
                              memberPriceLak: payload.memberPriceLak,
                              memberDiscountLak: payload.memberDiscountLak,
                              commissionPoolLak: payload.commissionPoolLak,
                              l1Percent: payload.l1Percent,
                              l2Percent: payload.l2Percent,
                              l3Percent: payload.l3Percent,
                            }
                          : item
                      );
                      setCustomCourses(nextCustom);
                      localStorage.setItem('dmc_rev26_academy_custom_v2', JSON.stringify(nextCustom));
                    } else {
                      const nextOverrides = {
                        ...courseOverrides,
                        [c.id]: {
                          ...(courseOverrides[c.id] || {}),
                          marketPriceLak: payload.marketPriceLak,
                          memberPriceLak: payload.memberPriceLak,
                          memberDiscountLak: payload.memberDiscountLak,
                          commissionPoolLak: payload.commissionPoolLak,
                          l1Percent: payload.l1Percent,
                          l2Percent: payload.l2Percent,
                          l3Percent: payload.l3Percent,
                        },
                      };
                      setCourseOverrides(nextOverrides);
                      localStorage.setItem(
                        'dmc_rev26_academy_overrides_v2',
                        JSON.stringify(nextOverrides)
                      );
                    }
                    setDownloadSuccessNotice(`Updated course "${c.title}" pricing numbers!`);
                    setTimeout(() => setDownloadSuccessNotice(null), 4000);
                  }}
                />
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>{t.progressLabel}</span>
                  <span className="font-mono text-amber-300 font-bold">{c.progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${c.progress}%` }}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    onClick={() => setActiveCourseId(c.id)}
                    className="flex-1 min-w-[140px] py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>
                      {c.progress === 100
                        ? t.reviewCourseMaterial
                        : c.progress > 0
                        ? t.continueWatching
                        : t.startCourse}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedCourseForQr({
                        id: c.id,
                        title: c.title,
                        memberPriceLak: c.memberPriceLak,
                        commissionPoolLak: c.commissionPoolLak,
                      })
                    }
                    className="px-3.5 py-2.5 rounded-xl bg-[#df1c2d] hover:bg-red-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer whitespace-nowrap shrink-0"
                    title="Enroll at DMC Member Price via Lao Bank QR"
                  >
                    <QrCode className="w-3.5 h-3.5 shrink-0" />
                    <span>Buy QR</span>
                  </button>

                  {c.id === 'c3' && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          setAutoDownload(false);
                          setIsCertOpen(true);
                        }}
                        className="px-2.5 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        title="View Official Certificate"
                      >
                        <Award className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={handleDirectDownload}
                        disabled={isDownloading}
                        className="px-2.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer disabled:opacity-60"
                        title="Download Certificate PNG"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

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
  );
};
