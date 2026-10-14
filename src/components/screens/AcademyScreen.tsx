/**
 * DMC XAYRAXA SUPER APP - REVISION 2.6
 * SCREEN 02 - ACADEMY (Learning Center) - 6-Language Localized
 */

import React, { useState } from 'react';
import { useDmc } from '../../context/DmcContext';
import { translations } from '../../utils/i18n';
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
} from 'lucide-react';
import {
  CopyrightCertificateModal,
  downloadDmcCertificateImage,
} from '../common/CopyrightCertificateModal';

export const AcademyScreen: React.FC = () => {
  const { currentMember, language, getMemberSongs } = useDmc();
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

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-amber-400" />
            <span>{t.academyTitle}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">{t.academySubtitle}</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
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
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
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

      {/* Course List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {localizedCourses.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.id}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                    {c.category}
                  </span>
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
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveCourseId(c.id)}
                    className="flex-1 mt-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      {c.progress === 100
                        ? t.reviewCourseMaterial
                        : c.progress > 0
                        ? t.continueWatching
                        : t.startCourse}
                    </span>
                  </button>
                  {c.id === 'c3' && (
                    <div className="flex gap-1.5 mt-1">
                      <button
                        onClick={() => {
                          setAutoDownload(false);
                          setIsCertOpen(true);
                        }}
                        className="px-2.5 py-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        title="View Official Certificate"
                      >
                        <Award className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={handleDirectDownload}
                        disabled={isDownloading}
                        className="px-2.5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer disabled:opacity-60"
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
    </div>
  );
};
