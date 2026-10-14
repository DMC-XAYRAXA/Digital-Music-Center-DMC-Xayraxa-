/**
 * DMC XAYRAXA SUPER APP - REVISION 2.6
 * SCREEN 06 - AI DMC (AI Music & Rev 2.6 Assistant) - 6-Language Localized
 */

import React, { useState, useEffect } from 'react';
import { useDmc } from '../../context/DmcContext';
import { translations } from '../../utils/i18n';
import { Sparkles, Send, Bot, User } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AiDmcScreen: React.FC = () => {
  const { currentMember, language } = useDmc();
  const t = translations[language];

  const welcomeByLang = {
    en: `Hello ${currentMember.name}! I am your AI DMC Music & Rev 2.6 Assistant. You can ask me about:\n• How the 1,600,000 LAK Music Package split works (400k/200k/100k)\n• How Free Member qualification and Held credits operate\n• How to prepare your original song idea for DMC studio recording\n• Any Rev 2.6 rules regarding Unilevel 3-Level structure!`,
    lo: `ສະບາຍດີ ${currentMember.name}! ຂ້ອຍແມ່ນຜູ້ຊ່ວຍ AI DMC Music & Rev 2.6 ຂອງທ່ານ. ທ່ານສາມາດຖາມຂ້ອຍກ່ຽວກັບ:\n• ໂຄງສ້າງການແບ່ງປັນຜົນແພັກເກດເພງ 1,600,000 ກີບ (L1 400k / L2 200k / L3 100k)\n• ວິທີສະສົມຍອດ Held ຂອງສະມາຊິກ Free ເພື່ອປົດລັອກ Active Lifetime\n• ການກຽມເນື້ອຮ້ອງ ແລະ ທຳນອງເພງສຳລັບອັດສຽງທີ່ DMC Studio ວຽງຈັນ`,
    th: `สวัสดีครับ ${currentMember.name}! ผมคือผู้ช่วยอัจฉริยะ AI DMC Music & Rev 2.6 คุณสามารถสอบถามเกี่ยวกับ:\n• โครงสร้างการแบ่งรายได้แพ็กเกจเพลง 1,600,000 กีบ (L1 400k / L2 200k / L3 100k)\n• วิธีสะสมยอด Held ของสมาชิก Free เพื่อปลดล็อก Active Lifetime\n• การเตรียมเนื้อร้องและทำนองเพื่อเข้าห้องอัด DMC Studio เวียงจันทน์`,
    vi: `Xin chào ${currentMember.name}! Tôi là Trợ lý AI DMC Music & Rev 2.6. Bạn có thể hỏi tôi về:\n• Cơ cấu chia hoa hồng Gói Âm Nhạc 1.600.000 LAK (L1 400k / L2 200k / L3 100k)\n• Cách tích lũy quỹ Held của thành viên Free để lên Active Trọn đời\n• Cách chuẩn bị bài hát gốc để thu âm tại DMC Studio Viêng Chăn`,
    zh: `您好 ${currentMember.name}！我是您的 AI DMC 智能音乐与制度助手。您可以向我咨询：\n• 1,600,000 基普单曲制作包的三级分润机制 (L1 40万 / L2 20万 / L3 10万)\n• 普通会员如何通过预留金 (Held) 免费升级终身正式会员\n• 如何准备原创歌曲前往万象 DMC 录音棚录制`,
    ko: `안녕하세요 ${currentMember.name}님! AI DMC 뮤직 & Rev 2.6 어시스턴트입니다. 무엇이든 물어보세요:\n• 1,600,000 LAK 음원 패키지 3단계 수수료 배분 (L1 40만 / L2 20만 / L3 10만)\n• 무료 회원의 Held 적립금 누적 및 정회원 자동 승급 방법\n• 비엔티안 DMC 스튜디오 보컬 레코딩 준비 가이드`,
  }[language];

  const samplePromptsByLang = {
    en: [
      'How does the 1.6M Music Package split work?',
      'What happens when a Free Member reaches 1.6M held credit?',
      'Explain the Rev 2.6 Scope Lock against Binary systems',
      'What are the steps for studio vocal recording?',
    ],
    lo: [
      'ການແບ່ງປັນຜົນແພັກເກດເພງ 1.6M ກີບ ເຮັດວຽກແນວໃດ?',
      'ເມື່ອສະມາຊິກ Free ສະສົມຄົບ 1.6M ກີບ ຈະເປັນແນວໃດ?',
      'ອະທິບາຍກົດ Rev 2.6 Unilevel 3 ຊັ້ນ',
      'ຂັ້ນຕອນການອັດສຽງຮ້ອງໃນ DMC Studio ມີຫຍັງແດ່?',
    ],
    th: [
      'การแบ่งคอมมิชชั่นแพ็กเกจเพลง 1.6M กีบทำงานอย่างไร?',
      'เมื่อสมาชิก Free สะสมครบ 1.6M กีบจะได้อะไรบ้าง?',
      'อธิบายกฎ Rev 2.6 Unilevel 3 ชั้น',
      'ขั้นตอนการอัดเสียงร้องในสตูดิโอ DMC มีอะไรบ้าง?',
    ],
    vi: [
      'Gói âm nhạc 1.6M LAK chia hoa hồng thế nào?',
      'Thành viên Free tích lũy đủ 1.6M LAK nhận được gì?',
      'Giải thích mô hình Unilevel 3 cấp Rev 2.6',
      'Quy trình thu âm bài hát tại DMC Studio gồm mấy bước?',
    ],
    zh: [
      '160万基普音乐套餐佣金如何分配？',
      '普通会员累计满160万基普预留金后会怎样？',
      '解析 Rev 2.6 严格三级直推制度',
      'DMC 录音棚单曲录制有哪些步骤？',
    ],
    ko: [
      '160만 킵 음원 패키지 수수료 배분 방식은?',
      '무료 회원이 160만 킵 적립금을 달성하면 어떻게 되나요?',
      'Rev 2.6 3단계 유니레벨 원칙 설명해 주세요',
      'DMC 스튜디오 보컬 녹음 절차는 어떻게 되나요?',
    ],
  }[language];

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: welcomeByLang,
      timestamp: '14:46',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Update initial greeting when language changes
  useEffect(() => {
    setMessages((prev) =>
      prev.map((m, idx) => (idx === 0 && m.sender === 'assistant' ? { ...m, text: welcomeByLang } : m))
    );
  }, [language, welcomeByLang]);

  const handleSend = (textToSend?: string) => {
    const q = textToSend || input;
    if (!q.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const replies = {
        en: `Under DMC Rev 2.6:\n• MUSIC_SINGLE_1600 (1,600,000 LAK) allocates 900,000 LAK to DMC Studio Production, 400,000 LAK to L1 Direct Sponsor, 200,000 LAK to L2, and 100,000 LAK to L3.\n• Free Members accumulate cleared referral commissions in HELD_FOR_QUALIFICATION until reaching 1,600,000 LAK to unlock Active Lifetime status + 1 Studio Song Entitlement.`,
        lo: `ຕາມມາດຕະຖານ DMC Rev 2.6:\n• ແພັກເກດ MUSIC_SINGLE_1600 (1,600,000 ກີບ) ຈັດສັນ 900,000 ກີບ ເຂົ້າງົບຜະລິດເພງສະຕູດິໂອ DMC, L1 ຮັບ 400,000 ກີບ, L2 ຮັບ 200,000 ກີບ ແລະ L3 ຮັບ 100,000 ກີບ.\n• ສະມາຊິກ Free ສະສົມຄອມມິດຊັນໃນບັນຊີ Held ຄົບ 1,600,000 ກີບ ເພື່ອປົດລັອກ Active Lifetime ພ້ອມສິດຜະລິດເພງ 1 ເພງຟຣີ!`,
        th: `ตามมาตรฐาน DMC Rev 2.6:\n• แพ็กเกจ MUSIC_SINGLE_1600 (1,600,000 กีบ) จัดสรร 900,000 กีบ เป็นงบผลิตเพลงสตูดิโอ DMC, ชั้น L1 รับ 400,000 กีบ, L2 รับ 200,000 กีบ และ L3 รับ 100,000 กีบ\n• สมาชิก Free สะสมคอมมิชชั่นในบัญชี Held ครบ 1,600,000 กีบ เพื่อปลดล็อก Active Lifetime พร้อมสิทธิ์ทำเพลงสตูดิโอ 1 เพลง!`,
        vi: `Theo chuẩn DMC Rev 2.6:\n• Gói MUSIC_SINGLE_1600 (1.600.000 LAK) phân bổ 900.000 LAK cho sản xuất phòng thu DMC, L1 nhận 400.000 LAK, L2 nhận 200.000 LAK và L3 nhận 100.000 LAK.\n• Thành viên Free tích lũy đủ 1.600.000 LAK trong quỹ Held sẽ mở khóa Active Trọn đời + 1 bài hát phòng thu!`,
        zh: `根据 DMC Rev 2.6 标准：\n• MUSIC_SINGLE_1600 套餐 (1,600,000 基普) 分配：DMC 录音棚制作费 900,000 基普，L1 直推奖 400,000 基普，L2 二代奖 200,000 基普，L3 三代奖 100,000 基普。\n• 普通会员累计满 160 万基普预留金即可免费解锁终身正式会员及 1 首单曲制作权益！`,
        ko: `DMC Rev 2.6 기준 안내:\n• MUSIC_SINGLE_1600 패키지(1,600,000 LAK)는 DMC 스튜디오 제작비 900,000 LAK, L1 직접 추천 400,000 LAK, L2 200,000 LAK, L3 100,000 LAK로 투명하게 배분됩니다.\n• 일반 회원은 Held 적립금 160만 킵 달성 시 평생 정회원(Active) 및 스튜디오 음원 1곡 제작권이 활성화됩니다!`,
      }[language];

      setMessages((prev) => [
        ...prev,
        {
          id: `ast-${Date.now()}`,
          sender: 'assistant',
          text: replies,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 500);
  };

  return (
    <div className="space-y-4 pb-12 animate-in fade-in flex flex-col h-[75vh]">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center text-slate-950 font-black shadow">
            <Sparkles className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-white flex items-center gap-1.5">
              <span>{t.aiDmcTitle}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                v2.6
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">{t.aiDmcSubtitle}</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2.5 text-xs ${
              m.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.sender === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`p-3.5 rounded-2xl max-w-[85%] whitespace-pre-line leading-relaxed shadow-sm ${
                m.sender === 'user'
                  ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-xs'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-xs'
              }`}
            >
              <p>{m.text}</p>
              <span
                className={`block text-[9px] mt-1.5 ${
                  m.sender === 'user' ? 'text-slate-800 text-right' : 'text-slate-500'
                }`}
              >
                {m.timestamp}
              </span>
            </div>

            {m.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Bot className="w-4 h-4 text-amber-400 animate-spin" />
            <span>AI DMC...</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
        {samplePromptsByLang.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 whitespace-nowrap transition-colors shrink-0 cursor-pointer"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={t.aiDmcPlaceholder}
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim()}
          className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
