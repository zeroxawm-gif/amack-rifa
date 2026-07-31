"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "../supabase";

const QUOTES = [
  "“Mencintaimu adalah hal terindah dalam hidupku.” ❤️",
  "“Terima kasih sudah jadi alasan senyumku setiap hari.” ✨",
  "“Jarak boleh memisahkan, tapi hati kita selalu dekat.” 🧸",
  "“Kamu adalah rumah tempat aku ingin pulang selamanya.” 🏡💖"
];

export default function Home() {
  const [u, setU] = useState<string | null>(null);
  const [tab, setTab] = useState<string>("chat");
  const [w, setW] = useState({ h: 0, j: 0, m: 0, d: 0 });
  const [quote, setQuote] = useState("");

  const [txt, setTxt] = useState(""); 
  const [lc, setLc] = useState<any[]>([]);
  const [cap, setCap] = useState(""); 
  const [lf, setLf] = useState<any[]>([]);
  const [jd, setJd] = useState(""); 
  const [yt, setYt] = useState(""); 
  const [lm, setLm] = useState<any[]>([]);
  const [suratList, setSuratList] = useState<any[]>([]);
  const [judulSurat, setJudulSurat] = useState(""); 
  const [isiSurat, setIsiSurat] = useState("");
  const [bukaSurat, setBukaSurat] = useState<any | null>(null);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [kegiatanWish, setKegiatanWish] = useState(""); 
  const [tglWish, setTglWish] = useState("");
  const [nobarList, setNobarList] = useState<any[]>([]);
  const [inputWebNobar, setInputWebNobar] = useState(""); 
  const [judulNobar, setJudulNobar] = useState("");

  const [financeList, setFinanceList] = useState<any[]>([]);
  const [finTipe, setFinTipe] = useState<"nabung" | "pengeluaran">("nabung");
  const [finJml, setFinJml] = useState(""); 
  const [finKet, setFinKet] = useState(""); 
  const [finTgl, setFinTgl] = useState("");
  const [bulanFilter, setBulanFilter] = useState("semua");

  const [animasiAktif, setAnimasiAktif] = useState<string | null>(null);

  const [gameSubTab, setGameSubTab] = useState<string>("kangen");
  const [bkgData, setBkgData] = useState<any>({ amack: "", rifa: "", hasil: "" });
  const [tttData, setTttData] = useState<any>({ board: Array(9).fill(""), turn: "amack", winner: "" });
  const [congklakData, setCongklakData] = useState<any>({ board: [4,4,4,4,4,4,4, 0, 4,4,4,4,4,4,4, 0], turn: "amack", winner: "" });
  const [isCongklakAnimating, setIsCongklakAnimating] = useState(false);
  const [animasiPesanInfo, setAnimasiPesanInfo] = useState("");
  const [skorAmack, setSkorAmack] = useState(0);
  const [skorRifa, setSkorRifa] = useState(0);

  const [diaryList, setDiaryList] = useState<any[]>([]);
  const [judulDiary, setJudulDiary] = useState("");
  const [isiDiary, setIsiDiary] = useState("");

  const [aiChatInput, setAiChatInput] = useState("");
  const [aiChatHistory, setAiChatHistory] = useState<any[]>([
    { sender: 'ai', text: " Halo Amack & Rifa! Aku AI Love Assistant kalian. Ada yang bisa kubantu? Tanya ide kencan, curhat, atau minta puisi romantis juga boleh! 💕" }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const [themeBgColor, setThemeBgColor] = useState("#ff9a9e");
  const [themeBgImage, setThemeBgImage] = useState("none");
  const [themeCard, setThemeCard] = useState("rgba(255,255,255,0.9)");

  const [moodAmack, setMoodAmack] = useState("😊 Senang");
  const [moodRifa, setMoodRifa] = useState("😊 Senang");
  const [zoom, setZoom] = useState<string | null>(null);

  const globalAudioRef = useRef<HTMLAudioElement>(null);
  const [currentSongTitle, setCurrentSongTitle] = useState<string | null>(null);
  const [isPlayingGlobal, setIsPlayingGlobal] = useState(false);

  const end = useRef<HTMLDivElement>(null);
  const aiEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    const jdDate = new Date("2025-07-03T00:00:00").getTime(); 
    const t = setInterval(() => {
      const s = new Date().getTime() - jdDate;
      setW({ h: Math.floor(s / 86400000), j: Math.floor((s / 3600000) % 24), m: Math.floor((s / 60000) % 60), d: Math.floor((s / 1000) % 60) });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  
  const playSoundEffect = (type: string) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      if (type === 'click') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.start(); osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'notif') {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        osc.start(); osc.stop(ctx.currentTime + 0.25);
      }
    } catch(e) {}
  };

  const loadAll = async () => {
    const { data: c } = await supabase.from('Pesan').select('*').order('createdAt', { ascending: true }); 
    if (c) {
      if (c.length > lc.length && lc.length > 0) playSoundEffect('notif');
      setLc(c);
    }
    const { data: f } = await supabase.from('Foto').select('*').order('createdAt', { ascending: false }); if (f) setLf(f);
    const { data: m } = await supabase.from('Musik').select('*').order('createdAt', { ascending: false }); if (m) setLm(m);
    const { data: s } = await supabase.from('SuratCinta').select('*').order('createdAt', { ascending: false }); if (s) setSuratList(s);
    const { data: b } = await supabase.from('BucketList').select('*'); if (b) setWishlist(b);
    const { data: nb } = await supabase.from('Nobar').select('*'); if (nb) setNobarList(nb);
    const { data: fn } = await supabase.from('CoupleFinance').select('*').order('createdAt', { ascending: false }); if (fn) setFinanceList(fn);
    const { data: dr } = await supabase.from('LoveDiary').select('*').order('createdAt', { ascending: false }); if (dr) setDiaryList(dr);

    const { data: gs } = await supabase.from('GameState').select('*');
    if (gs) {
      gs.forEach(g => {
        if (g.game === 'bkg') setBkgData(g.data);
        if (g.game === 'tictactoe') setTttData(g.data);
        if (g.game === 'congklak') setCongklakData(g.data);
        if (g.game === 'skorKangen') { setSkorAmack(g.data.amack || 0); setSkorRifa(g.data.rifa || 0); }
      });
    }

    if (u) {
      const { data: th } = await supabase.from('UserTheme').select('*').eq('userId', u).single();
      if (th) { 
        if (th.bgColor) setThemeBgColor(th.bgColor); 
        if (th.cardColor) setThemeCard(th.cardColor); 
        if (th.motif) setThemeBgImage(th.motif); 
      }
    }
    const { data: md } = await supabase.from('Mood').select('*');
    if (md) md.forEach(item => { if (item.userId === 'amack') setMoodAmack(item.mood); if (item.userId === 'rifa') setMoodRifa(item.mood); });
  };

      useEffect(() => {
    loadAll();

    const channel = supabase
      .channel('public:all-tables')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public' },
        async (payload) => {
          // Memastikan data ditarik ulang secara instan begitu ada perubahan
          await loadAll();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => { if (tab === 'chat') end.current?.scrollIntoView({ behavior: 'smooth' }); }, [lc, tab]);
  useEffect(() => { if (tab === 'ai') aiEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [aiChatHistory, tab]);

  const del = async (tbl: string, id: string) => { playSoundEffect('click'); if (confirm("Hapus data ini?")) { await supabase.from(tbl).delete().eq('id', id); loadAll(); } };
  const sendC = async (e: any) => { e.preventDefault(); if (!txt || !u) return; playSoundEffect('click'); await supabase.from('Pesan').insert([{ id: Date.now().toString(), teks: txt, senderId: u }]); setTxt(""); loadAll(); };
  const upF = (e: any) => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onloadend = async () => { await supabase.from('Foto').insert([{ id: Date.now().toString(), url: r.result as string, caption: cap || "Kenangan", senderId: u }]); setCap(""); loadAll(); }; r.readAsDataURL(f); };
  
  const upM = (e: any) => { 
    const f = e.target.files[0]; 
    if (!f) return; 
    const r = new FileReader(); 
    r.onloadend = async () => { 
      await supabase.from('Musik').insert([{ id: Date.now().toString(), judul: jd || f.name, url: r.result as string, tipe: 'upload', senderId: u }]); 
      setJd(""); 
      loadAll(); 
    }; 
    r.readAsDataURL(f); 
  };

  const addY = async (e: any) => { e.preventDefault(); if (!yt || !jd || !u) return; let url = yt; if (url.includes("watch?v=")) url = url.replace("watch?v=", "embed/"); else if (url.includes("youtu.be/")) url = url.replace("youtu.be/", "www.youtube.com/embed/"); await supabase.from('Musik').insert([{ id: Date.now().toString(), judul: jd, url: url, tipe: 'youtube', senderId: u }]); setJd(""); setYt(""); loadAll(); };
  const kirimSurat = async (e: any) => { e.preventDefault(); if (!judulSurat || !isiSurat || !u) return; playSoundEffect('click'); await supabase.from('SuratCinta').insert([{ id: Date.now().toString(), judul: judulSurat, isi: isiSurat, senderId: u }]); setJudulSurat(""); setIsiSurat(""); loadAll(); };
  const tambahWish = async (e: any) => { e.preventDefault(); if (!kegiatanWish || !tglWish) return; playSoundEffect('click'); await supabase.from('BucketList').insert([{ id: Date.now().toString(), kegiatan: kegiatanWish, tanggal: tglWish, selesai: false }]); setKegiatanWish(""); setTglWish(""); loadAll(); };
  const toggleWish = async (id: string, status: boolean) => { playSoundEffect('click'); await supabase.from('BucketList').update({ selesai: !status }).eq('id', id); loadAll(); };
  const mulaiNobarWeb = async (e: any) => { e.preventDefault(); if (!inputWebNobar || !judulNobar) return; playSoundEffect('click'); let targetUrl = inputWebNobar; if (!targetUrl.startsWith("http")) targetUrl = "https://" + targetUrl; await supabase.from('Nobar').delete().neq('id', '0'); await supabase.from('Nobar').insert([{ id: Date.now().toString(), url: targetUrl, judul: judulNobar }]); setInputWebNobar(""); setJudulNobar(""); loadAll(); };
  const gantiMood = async (mBaru: string) => { if (!u) return; if (u === 'amack') setMoodAmack(mBaru); else setMoodRifa(mBaru); await supabase.from('Mood').upsert({ userId: u, mood: mBaru }, { onConflict: 'userId' }); };

  const playGlobalAudio = (m: any) => {
    playSoundEffect('click');
    if (m.tipe === 'youtube') {
      alert("Format YouTube tidak bisa diputar sebagai background audio karena diblokir sistem browser HP. Silakan gunakan file MP3 hasil Upload MP3 HP.");
      return;
    }
    setCurrentSongTitle(m.judul);
    setIsPlayingGlobal(true);
    if (globalAudioRef.current) {
      globalAudioRef.current.src = m.url;
      globalAudioRef.current.load();
      globalAudioRef.current.play().catch((err) => console.log("Audio play error:", err));
    }
  };

const stopGlobalAudio = () => {
    playSoundEffect('click');
    if (globalAudioRef.current) {
      globalAudioRef.current.pause();
      globalAudioRef.current.currentTime = 0;
    }
    setIsPlayingGlobal(false);
    setCurrentSongTitle(null);
  };

  const tambahFinance = async (e: any) => {
    e.preventDefault(); if (!finJml || !u) return; playSoundEffect('click');
    const tglFinal = finTgl || new Date().toISOString().split('T')[0];
    await supabase.from('CoupleFinance').insert([{ id: Date.now().toString(), tipe: finTipe, jumlah: Number(finJml), keterangan: finKet || (finTipe === 'nabung' ? 'Nabung Bareng' : 'Pengeluaran'), senderId: u, createdAt: tglFinal }]);
    setFinJml(""); setFinKet(""); setFinTgl(""); loadAll();
  };

    const tambahDiary = async (e: any) => {
    e.preventDefault(); 
    if (!judulDiary || !isiDiary || !u) return; 
    playSoundEffect('click');
    
    const { error } = await supabase.from('LoveDiary').insert([
      { id: Date.now().toString(), judul: judulDiary, isi: isiDiary, senderId: u }
    ]);
    
    if (error) {
      console.log("Error diary:", error.message);
      alert("Gagal menyimpan diary: " + error.message);
    } else {
      setJudulDiary(""); 
      setIsiDiary(""); 
      loadAll();
    }
  };
  
  const kirimPesanAI = async (e: any) => {
    e.preventDefault();
    if (!aiChatInput.trim() || isAiLoading) return;
    playSoundEffect('click');
    const userMsg = aiChatInput;
    setAiChatInput("");
    setAiChatHistory(prev => [...prev, { sender: 'user', text: userMsg }]);
    setIsAiLoading(true);

    let reply = "Aduh, AI lagi agak pusing nih sayang. Tapi ingetin ya, kalian berdua pasangan hebat! ❤️";
    const low = userMsg.toLowerCase();

    if (low.includes('kencan') || low.includes('ide') || low.includes('date')) {
      const ideKencan = [
        "Ide kencan seru: Piknik sore di taman kota sambil bawa makanan buatan sendiri! 🥪🌳",
        "Bagaimana kalau malam ini kalian Video Call sambil Nonton Film (fitur Nobar di atas) film romantis? 🎬🍿",
        "Kencan hemat: Masak resep baru bareng di dapur virtual sambil dengerin musik favorit kalian! 👩‍🍳👨‍🍳"
      ];
      reply = ideKencan[Math.floor(Math.random() * ideKencan.length)];
    } else if (low.includes('marah') || low.includes('ngambek') || low.includes('sedih') || low.includes('pertengkaran')) {
      reply = "Wah, lagi ada masalah ya? Coba tarik napas dalam-dalam. Ingat, komunikasi itu kuncinya. Amack dan Rifa harus saling mendengarkan dan mengalah ya demi hubungan kalian! 🤗💕";
    } else if (low.includes('puisi') || low.includes('gombal') || low.includes('romantis')) {
      reply = "Nih gombalan buat kalian: 'Beli mentimun beli ke pasar, hatiku santun karena kamu yang bersandar.' Eakk! ✨😘";
    } else {
      reply = `Wah pertanyaan bagus '${userMsg}'! Apapun keadaannya, pastikan kalian selalu saling dukung, sabar, dan luangkan waktu buat ketawa bareng ya Amack & Rifa! 💖`;
    }

    setTimeout(() => {
      setAiChatHistory(prev => [...prev, { sender: 'ai', text: reply }]);
      setIsAiLoading(false);
      playSoundEffect('notif');
    }, 800);
  };

  const filteredFinance = financeList.filter(f => {
    if (bulanFilter === 'semua') return true;
    const tglItem = f.createdAt ? f.createdAt.substring(0, 7) : "";
    return tglItem === bulanFilter;
  });
  const totalNabung = filteredFinance.filter(f => f.tipe === 'nabung').reduce((acc, curr) => acc + Number(curr.jumlah), 0);
  const totalKeluar = filteredFinance.filter(f => f.tipe === 'pengeluaran').reduce((acc, curr) => acc + Number(curr.jumlah), 0);

  const triggerAnimasi = (jenis: string) => {
    playSoundEffect('notif');
    setAnimasiAktif(jenis);
    setTimeout(() => setAnimasiAktif(null), 3500);
  };

const pilihBKG = async (pilihan: string) => {
    if (!u) return; playSoundEffect('click');
    const newData = { ...bkgData, [u]: pilihan };
    if (newData.amack && newData.rifa) {
      let h = "Seri! 🤝";
      if (newData.amack === newData.rifa) h = "Seri! 🤝";
      else if ((newData.amack === 'batu' && newData.rifa === 'gunting') || (newData.amack === 'kertas' && newData.rifa === 'batu') || (newData.amack === 'gunting' && newData.rifa === 'kertas')) h = "Amack Menang! 🏆";
      else h = "Rifa Menang! 🏆";
      newData.hasil = h;
    }
    setBkgData(newData);
    await supabase.from('GameState').upsert({ game: 'bkg', data: newData }, { onConflict: 'game' });
  };
  const resetBKG = async () => { playSoundEffect('click'); const empty = { amack: "", rifa: "", hasil: "" }; setBkgData(empty); await supabase.from('GameState').upsert({ game: 'bkg', data: empty }, { onConflict: 'game' }); };

  const playTTT = async (idx: number) => {
    if (!u || tttData.board[idx] !== "" || tttData.winner !== "" || tttData.turn !== u) return; 
    playSoundEffect('click');
    const newBoard = [...tttData.board];
    newBoard[idx] = u === 'amack' ? 'X' : 'O';
    const nextTurn = u === 'amack' ? 'rifa' : 'amack';
    
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    let win = "";
    for (let l of lines) {
      const [a,b,c] = l;
      if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
        win = newBoard[a] === 'X' ? 'Amack Menang! 🏆' : 'Rifa Menang! 🏆';
      }
    }
    if (!win && !newBoard.includes("")) win = "Seri! 🤝";

    const newTtt = { board: newBoard, turn: nextTurn, winner: win };
    setTttData(newTtt);
    await supabase.from('GameState').upsert({ game: 'tictactoe', data: newTtt }, { onConflict: 'game' });
  };
  const resetTTT = async () => { playSoundEffect('click'); const empty = { board: Array(9).fill(""), turn: "amack", winner: "" }; setTttData(empty); await supabase.from('GameState').upsert({ game: 'tictactoe', data: empty }, { onConflict: 'game' }); };

  const playCongklakWithAnimation = async (idx: number) => {
    if (!u || isCongklakAnimating) return;
    if (u === 'amack' && (congklakData.turn !== 'amack' || idx < 0 || idx > 6 || congklakData.board[idx] === 0)) return;
    if (u === 'rifa' && (congklakData.turn !== 'rifa' || idx < 8 || idx > 14 || congklakData.board[idx] === 0)) return;

    playSoundEffect('click');
    setIsCongklakAnimating(true);
    setAnimasiPesanInfo("Biji sedang berjalan satu-satu...");

    let tempBoard = [...congklakData.board];
    let biji = tempBoard[idx];
    tempBoard[idx] = 0;
    let curIdx = idx;

    const stepMove = (bijiSisa: number, indexAktif: number) => {
      if (bijiSisa > 0) {
        indexAktif = (indexAktif + 1) % 16;
        tempBoard[indexAktif]++;
        setCongklakData({ ...congklakData, board: [...tempBoard] });
        playSoundEffect('click');

        setTimeout(() => {
          stepMove(bijiSisa - 1, indexAktif);
        }, 180);
      } else {
        let nextTurn = congklakData.turn === 'amack' ? 'rifa' : 'amack';
        let win = "";
        const totalAmack = tempBoard.slice(0, 7).reduce((a,b)=>a+b, 0);
        const totalRifa = tempBoard.slice(8, 15).reduce((a,b)=>a+b, 0);
        if (totalAmack === 0 || totalRifa === 0) {
          if (tempBoard[7] > tempBoard[15]) win = "Amack Menang di Congklak! 🏆";
          else if (tempBoard[15] > tempBoard[7]) win = "Rifa Menang di Congklak! 🏆";
          else win = "Permainan Seri! 🤝";
        }

        const finalData = { board: tempBoard, turn: nextTurn, winner: win };
        setCongklakData(finalData);
        supabase.from('GameState').upsert({ game: 'congklak', data: finalData }, { onConflict: 'game' });
        setIsCongklakAnimating(false);
        setAnimasiPesanInfo("");
      }
    };

    stepMove(biji, curIdx);
  };

  const resetCongklak = async () => { 
    playSoundEffect('click'); 
    const empty = { board: [4,4,4,4,4,4,4, 0, 4,4,4,4,4,4,4, 0], turn: "amack", winner: "" }; 
    setCongklakData(empty); 
    await supabase.from('GameState').upsert({ game: 'congklak', data: empty }, { onConflict: 'game' }); 
  };

  const tambahSkorKangen = async () => { if (!u) return; playSoundEffect('click'); const sA = u === 'amack' ? skorAmack + 1 : skorAmack; const sR = u === 'rifa' ? skorRifa + 1 : skorRifa; setSkorAmack(sA); setSkorRifa(sR); await supabase.from('GameState').upsert({ game: 'skorKangen', data: { amack: sA, rifa: sR } }, { onConflict: 'game' }); };

  const simpanTema = async (bgc: string, cardc: string, mot: string) => {
    playSoundEffect('click'); 
    setThemeBgColor(bgc); 
    setThemeCard(cardc); 
    setThemeBgImage(mot);
    if (u) await supabase.from('UserTheme').upsert({ userId: u, bgColor: bgc, cardColor: cardc, motif: mot }, { onConflict: 'userId' });
  };

  if (!u) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backgroundColor: '#ff9a9e', backgroundImage: 'radial-gradient(circle, #ff9a9e, #feada6)', fontFamily: 'sans-serif' }}>
        <div style={{ background: 'rgba(255,255,255,0.95)', padding: '35px 25px', borderRadius: '30px', width: '100%', maxWidth: '330px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
          <div style={{ fontSize: '40px', marginBottom: '8px' }}>❤️</div>
          <h1 style={{ fontSize: '26px', fontWeight: '900', color: '#ff4757', marginBottom: '4px' }}>Amack & Rifa</h1>
          <p style={{ fontSize: '11px', color: '#777', marginBottom: '22px', fontStyle: 'italic' }}>Our Special Love Space</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button onClick={() => setU('amack')} style={{ padding: '14px', background: '#8B5A2B', color: '#fff', fontWeight: 'bold', borderRadius: '16px', border: 'none', cursor: 'pointer' }}>🐻 Masuk Amack</button>
            <button onClick={() => setU('rifa')} style={{ padding: '14px', background: '#fff', color: '#ff4757', fontWeight: 'bold', borderRadius: '16px', border: '2px solid #ff4757', cursor: 'pointer' }}>🐼 Masuk Rifa</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 10px 125px 10px', backgroundColor: themeBgColor, backgroundImage: themeBgImage !== 'none' ? themeBgImage : undefined, fontFamily: 'sans-serif', transition: 'background 0.5s', position: 'relative' }}>
      
      <audio ref={globalAudioRef} preload="auto" />

      {animasiAktif && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 120 }}>
          <div style={{ background: '#fff', padding: '30px 40px', borderRadius: '25px', textAlign: 'center', boxShadow: '0 15px 35px rgba(0,0,0,0.3)' }}>
            <div style={{ fontSize: '75px', marginBottom: '10px' }}>{animasiAktif === 'hug' ? '🫂🤗' : '💋😘'}</div>
            <h2 style={{ fontSize: '18px', color: '#ff4757', fontWeight: 'bold' }}>{animasiAktif === 'hug' ? '🤗 Virtual Hug Berhasil Dikirim! 🤗' : '💋 Virtual Kiss Berhasil Dikirim! 💋'}</h2>
          </div>
        </div>
      )}

      {zoom && <div onClick={() => setZoom(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '10px' }}><img src={zoom} style={{ width: '100%', maxHeight: '85vh', objectFit: 'contain', borderRadius: '12px' }} /></div>}
      {bukaSurat && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 110, padding: '16px' }}><div style={{ background: '#fff', width: '100%', maxWidth: '340px', padding: '20px', borderRadius: '20px', textAlign: 'left' }}><h3 style={{ color: '#ff4757', fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>💌 {bukaSurat.judul}</h3><p style={{ fontSize: '12px', color: '#444', lineHeight: '1.5', marginBottom: '15px' }}>{bukaSurat.isi}</p><button onClick={() => setBukaSurat(null)} style={{ width: '100%', padding: '10px', background: '#ff4757', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold' }}>Tutup</button></div></div>}

      {isPlayingGlobal && currentSongTitle && (
        <div style={{ width: '100%', maxWidth: '380px', background: 'rgba(0,0,0,0.85)', color: '#fff', padding: '8px 14px', borderRadius: '12px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
          <span>🎶 Musik Background: <b>{currentSongTitle}</b></span>
          <button onClick={stopGlobalAudio} style={{ background: '#ff4757', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>Matikan ⏹</button>
        </div>
      )}

      <div style={{ width: '100%', maxWidth: '380px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ background: themeCard, padding: '6px 14px', borderRadius: '14px', fontSize: '11px', fontWeight: 'bold' }}>Hi, {u === 'amack' ? 'Amack 🐻' : 'Rifa 🐼'}</span>
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          <select value={u === 'amack' ? moodAmack : moodRifa} onChange={(e) => gantiMood(e.target.value)} style={{ padding: '6px 10px', borderRadius: '12px', fontSize: '10px', background: '#fff', fontWeight: 'bold' }}>
            <option value="😊 Senang">😊 Senang</option><option value="🥰 Sayang">🥰 Sayang</option><option value="🥺 Kangen">🥺 Kangen</option><option value="😤 Ngambek">😤 Ngambek</option>
          </select>
          <button onClick={() => setU(null)} style={{ background: themeCard, color: '#ff4757', border: 'none', padding: '6px 12px', borderRadius: '14px', fontSize: '11px', fontWeight: 'bold' }}>Keluar</button>
        </div>
      </div>
      
      <div style={{ width: '100%', maxWidth: '380px', display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <button onClick={() => triggerAnimasi('hug')} style={{ flex: 1, padding: '8px', background: '#ff7675', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>🤗 Kirim Virtual Hug</button>
        <button onClick={() => triggerAnimasi('kiss')} style={{ flex: 1, padding: '8px', background: '#fd79a8', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>💋 Kirim Virtual Kiss</button>
      </div>

      <div style={{ width: '100%', maxWidth: '380px', background: themeCard, padding: '12px 16px', borderRadius: '16px', marginBottom: '10px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}>
        <p style={{ fontSize: '13px', color: '#d63031', fontWeight: 'bold', fontStyle: 'italic', lineHeight: '1.4' }}>{quote}</p>
      </div>

      <div style={{ width: '100%', maxWidth: '380px', background: themeCard, padding: '12px', borderRadius: '18px', marginBottom: '8px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '10px', fontWeight: 'bold', color: '#ff4757', marginBottom: '6px' }}>OUR LOVE JOURNEY ❤️</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '5px' }}>
          <div style={{ background: '#fff0f3', padding: '6px', borderRadius: '10px' }}><span style={{ fontSize: '13px', fontWeight: 'bold' }}>{w.h}</span><br/><span style={{ fontSize: '6px', color: '#ff4757' }}>HARI</span></div>
          <div style={{ background: '#f3e8ff', padding: '6px', borderRadius: '10px' }}><span style={{ fontSize: '13px', fontWeight: 'bold' }}>{w.j}</span><br/><span style={{ fontSize: '6px', color: '#9333ea' }}>JAM</span></div>
          <div style={{ background: '#e0f2fe', padding: '6px', borderRadius: '10px' }}><span style={{ fontSize: '13px', fontWeight: 'bold' }}>{w.m}</span><br/><span style={{ fontSize: '6px', color: '#0284c7' }}>MENIT</span></div>
          <div style={{ background: '#e0e7ff', padding: '6px', borderRadius: '10px' }}><span style={{ fontSize: '13px', fontWeight: 'bold' }}>{w.d}</span><br/><span style={{ fontSize: '6px', color: '#4f46e5' }}>DETIK</span></div>
        </div>
      </div>

      {tab === 'chat' && (
        <div style={{ width: '100%', maxWidth: '380px', background: themeCard, padding: '12px', borderRadius: '20px', display: 'flex', flexDirection: 'column', height: '360px' }}>
          <h3 style={{ fontSize: '10px', fontWeight: 'bold', color: '#ff4757', marginBottom: '6px', borderBottom: '1px solid #ffe4e6', paddingBottom: '4px' }}>💌 RUANG CHAT</h3>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto', textAlign: 'left', marginBottom: '6px' }}>
            {lc.map((p) => (
              <div key={p.id} style={{ position: 'relative', padding: '8px 12px', borderRadius: '12px', maxWidth: '85%', ...(p.senderId === u ? { marginLeft: 'auto', background: '#ff4757', color: '#fff' } : { marginRight: 'auto', background: '#fff', border: '1px solid #ffe4e6' }) }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: '7px', fontWeight: 'bold' }}>{p.senderId}</span><button onClick={() => del('Pesan', p.id)} style={{ background: 'none', border: 'none', fontSize: '9px', cursor: 'pointer' }}>✕</button></div>
                <p style={{ fontSize: '11px', marginTop: '2px' }}>{p.teks}</p>
              </div>
            ))}
            <div ref={end} />
          </div>
          <form onSubmit={sendC} style={{ display: 'flex', gap: '5px' }}><input type="text" value={txt} onChange={(x) => setTxt(x.target.value)} placeholder="Tulis pesan..." style={{ width: '100%', padding: '8px 10px', borderRadius: '10px', border: '1px solid #ffd1dc', fontSize: '10px', outline: 'none' }} /><button type="submit" style={{ background: '#ff4757', color: '#fff', border: 'none', borderRadius: '10px', padding: '0 12px', fontSize: '10px', fontWeight: 'bold' }}>Kirim</button></form>
        </div>
      )}

      {tab === 'ai' && (
        <div style={{ width: '100%', maxWidth: '380px', background: themeCard, padding: '12px', borderRadius: '20px', display: 'flex', flexDirection: 'column', height: '390px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '11px', fontWeight: 'bold', color: '#0984e3', marginBottom: '6px', borderBottom: '1px solid #74b9ff', paddingBottom: '4px' }}>🤖 AI LOVE ASSISTANT (TANYA-TANYA)</h3>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto', textAlign: 'left', marginBottom: '6px', background: '#f0f9ff', padding: '8px', borderRadius: '12px' }}>
            {aiChatHistory.map((msg, idx) => (
              <div key={idx} style={{ padding: '8px 10px', borderRadius: '10px', maxWidth: '85%', fontSize: '10px', ...(msg.sender === 'user' ? { marginLeft: 'auto', background: '#0984e3', color: '#fff' } : { marginRight: 'auto', background: '#fff', color: '#333', border: '1px solid #bae6fd' }) }}>
                <p style={{ fontWeight: 'bold', fontSize: '7px', marginBottom: '2px', color: msg.sender === 'user' ? '#e0f2fe' : '#0284c7' }}>{msg.sender === 'user' ? u?.toUpperCase() : 'AI LOVE ASSISTANT'}</p>
                {msg.text}
              </div>
            ))}
            {isAiLoading && <p style={{ fontSize: '9px', fontStyle: 'italic', color: '#0284c7' }}>AI sedang mengetik jawaban...</p>}
            <div ref={aiEndRef} />
          </div>

          <form onSubmit={kirimPesanAI} style={{ display: 'flex', gap: '5px' }}>
            <input type="text" value={aiChatInput} onChange={(e) => setAiChatInput(e.target.value)} placeholder="Tanya ide kencan, tips hubungan, puisi..." style={{ width: '100%', padding: '8px 10px', borderRadius: '10px', border: '1px solid #bae6fd', fontSize: '10px', outline: 'none' }} />
            <button type="submit" disabled={isAiLoading} style={{ background: '#0984e3', color: '#fff', border: 'none', borderRadius: '10px', padding: '0 12px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Tanya</button>
          </form>
        </div>
      )}

      {tab === 'foto' && (
        <div style={{ width: '100%', maxWidth: '380px', background: themeCard, padding: '12px', borderRadius: '20px', display: 'flex', flexDirection: 'column', height: '360px' }}>
          <h3 style={{ fontSize: '10px', fontWeight: 'bold', color: '#9333ea', marginBottom: '6px', borderBottom: '1px solid #f3e8ff', paddingBottom: '4px' }}>📸 GALERI FOTO</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '6px', background: '#faf5ff', padding: '8px', borderRadius: '12px' }}>
            <input type="text" value={cap} onChange={(x) => setCap(x.target.value)} placeholder="Judul foto..." style={{ width: '100%', padding: '6px 8px', borderRadius: '8px', border: '1px solid #e9d5ff', fontSize: '10px', outline: 'none' }} />
            <label style={{ width: '100%', padding: '6px', background: '#9333ea', color: '#fff', fontWeight: 'bold', borderRadius: '8px', fontSize: '10px', textAlign: 'center', cursor: 'pointer' }}>📁 Upload Foto HP<input type="file" accept="image/*" onChange={upF} style={{ display: 'none' }} /></label>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
            {lf.map((f) => (<div key={f.id} style={{ background: '#fff', padding: '8px', borderRadius: '12px', border: '1px solid #f3e8ff', position: 'relative' }}><button onClick={() => del('Foto', f.id)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: '18px', height: '18px', fontSize: '8px' }}>✕</button><img src={f.url} onClick={() => setZoom(f.url)} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer' }} /><p style={{ fontSize: '10px', fontWeight: 'bold', marginTop: '4px' }}>{f.caption}</p></div>))}
          </div>
        </div>
      )}

      {tab === 'musik' && (
        <div style={{ width: '100%', maxWidth: '380px', background: themeCard, padding: '12px', borderRadius: '20px', display: 'flex', flexDirection: 'column', height: '390px' }}>
          <h3 style={{ fontSize: '10px', fontWeight: 'bold', color: '#0284c7', marginBottom: '6px', borderBottom: '1px solid #e0f2fe', paddingBottom: '4px' }}>🎵 PLAYLIST MUSIK & BACKGROUND</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '6px', background: '#f0f9ff', padding: '8px', borderRadius: '12px' }}>
            <input type="text" value={jd} onChange={(x) => setJd(x.target.value)} placeholder="Judul lagu..." style={{ width: '100%', padding: '6px 8px', borderRadius: '8px', border: '1px solid #bae6fd', fontSize: '10px', outline: 'none' }} />
            <div style={{ display: 'flex', gap: '4px' }}><input type="text" value={yt} onChange={(x) => setYt(x.target.value)} placeholder="Link YouTube..." style={{ width: '100%', padding: '6px 8px', borderRadius: '8px', border: '1px solid #bae6fd', fontSize: '10px', outline: 'none' }} /><button onClick={addY} style={{ background: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', padding: '0 10px', fontSize: '10px', fontWeight: 'bold' }}>YT</button></div>
            <label style={{ width: '100%', padding: '5px', background: '#0284c7', color: '#fff', fontWeight: 'bold', borderRadius: '8px', fontSize: '9px', textAlign: 'center', cursor: 'pointer' }}>📁 Upload MP3 HP<input type="file" accept="audio/*" onChange={upM} style={{ display: 'none' }} /></label>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
            {lm.map((m) => (
              <div key={m.id} style={{ background: '#fff', padding: '10px', borderRadius: '12px', border: '1px solid #e0f2fe' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 'bold' }}>🎶 {m.judul}</p>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button onClick={() => playGlobalAudio(m)} style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: '5px', padding: '3px 8px', fontSize: '9px', cursor: 'pointer', fontWeight: 'bold' }}>Putar BG 🎧</button>
                    <button onClick={() => del('Musik', m.id)} style={{ background: '#ff4757', color: '#fff', border: 'none', borderRadius: '50%', width: '18px', height: '18px', fontSize: '8px' }}>✕</button>
                  </div>
                </div>
                {m.tipe === 'youtube' && <iframe src={m.url} style={{ width: '100%', height: '140px', border: 'none', borderRadius: '8px' }} allow="autoplay"></iframe>}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'surat' && (
        <div style={{ width: '100%', maxWidth: '380px', background: themeCard, padding: '12px', borderRadius: '20px', display: 'flex', flexDirection: 'column', height: '360px' }}>
          <h3 style={{ fontSize: '10px', fontWeight: 'bold', color: '#e84393', marginBottom: '6px', borderBottom: '1px solid #fd79a8', paddingBottom: '4px' }}>💌 SURAT CINTA RAHASIA</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '6px', background: '#fff0f5', padding: '8px', borderRadius: '12px' }}>
            <input type="text" value={judulSurat} onChange={(x) => setJudulSurat(x.target.value)} placeholder="Judul Surat..." style={{ width: '100%', padding: '6px 8px', borderRadius: '8px', border: '1px solid #ffb6c1', fontSize: '10px', outline: 'none' }} />
            <textarea value={isiSurat} onChange={(x) => setIsiSurat(x.target.value)} placeholder="Tulis isi surat romantis..." style={{ width: '100%', height: '40px', padding: '6px 8px', borderRadius: '8px', border: '1px solid #ffb6c1', fontSize: '10px', outline: 'none', resize: 'none' }} />
            <button onClick={kirimSurat} style={{ background: '#e84393', color: '#fff', border: 'none', borderRadius: '8px', padding: '6px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Kirim Surat 💌</button>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto' }}>
            {suratList.map((s) => (<div key={s.id} onClick={() => setBukaSurat(s)} style={{ background: '#fff', padding: '10px', borderRadius: '12px', border: '1px solid #fd79a8', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><p style={{ fontSize: '11px', fontWeight: 'bold', color: '#e84393' }}>✉️ {s.judul}</p></div><button onClick={(e) => { e.stopPropagation(); del('SuratCinta', s.id); }} style={{ background: '#ff4757', color: '#fff', border: 'none', borderRadius: '50%', width: '18px', height: '18px', fontSize: '8px' }}>✕</button></div>))}
          </div>
        </div>
      )}

      {tab === 'wishlist' && (
        <div style={{ width: '100%', maxWidth: '380px', background: themeCard, padding: '12px', borderRadius: '20px', display: 'flex', flexDirection: 'column', height: '360px' }}>
          <h3 style={{ fontSize: '10px', fontWeight: 'bold', color: '#00b894', marginBottom: '6px', borderBottom: '1px solid #55efc4', paddingBottom: '4px' }}>✨ WISHLIST & TANGGAL KENCAN</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '6px', background: '#e8f8f5', padding: '8px', borderRadius: '12px' }}>
            <input type="text" value={kegiatanWish} onChange={(x) => setKegiatanWish(x.target.value)} placeholder="Impian wishlist kencan..." style={{ width: '100%', padding: '6px 8px', borderRadius: '8px', border: '1px solid #a3e4d7', fontSize: '10px', outline: 'none' }} />
            <input type="date" value={tglWish} onChange={(x) => setTglWish(x.target.value)} style={{ width: '100%', padding: '6px 8px', borderRadius: '8px', border: '1px solid #a3e4d7', fontSize: '10px', outline: 'none' }} />
            <button onClick={tambahWish} style={{ background: '#00b894', color: '#fff', border: 'none', borderRadius: '8px', padding: '6px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Tambah Wishlist ✨</button>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto' }}>
            {wishlist.map((b) => (<div key={b.id} onClick={() => toggleWish(b.id, b.selesai)} style={{ background: '#fff', padding: '8px 10px', borderRadius: '12px', border: '1px solid #55efc4', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: b.selesai ? 0.6 : 1 }}><div><p style={{ fontSize: '11px', fontWeight: 'bold', textDecoration: b.selesai ? 'line-through' : 'none' }}>{b.kegiatan}</p><p style={{ fontSize: '8px', color: '#00b894', fontWeight: 'bold' }}>📅 Target: {b.tanggal}</p></div><button onClick={(e) => { e.stopPropagation(); del('BucketList', b.id); }} style={{ background: '#ff4757', color: '#fff', border: 'none', borderRadius: '50%', width: '18px', height: '18px', fontSize: '8px' }}>✕</button></div>))}
          </div>
        </div>
      )}

      {tab === 'finance' && (
        <div style={{ width: '100%', maxWidth: '380px', background: themeCard, padding: '16px', borderRadius: '22px', display: 'flex', flexDirection: 'column', height: '460px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#6c5ce7', marginBottom: '8px', borderBottom: '1px solid #a29bfe', paddingBottom: '6px' }}>💳 COUPLE FINANCE (REKAP KEUANGAN)</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
            <div style={{ background: '#e8f8f5', padding: '8px', borderRadius: '10px', textAlign: 'center', border: '1px solid #a3e4d7' }}>
              <p style={{ fontSize: '8px', color: '#00b894', fontWeight: 'bold' }}>TOTAL NABUNG</p>
              <p style={{ fontSize: '13px', fontWeight: '900', color: '#00b894' }}>Rp {totalNabung.toLocaleString('id-ID')}</p>
            </div>
            <div style={{ background: '#fdedec', padding: '8px', borderRadius: '10px', textAlign: 'center', border: '1px solid #f5b7b1' }}>
              <p style={{ fontSize: '8px', color: '#e74c3c', fontWeight: 'bold' }}>TOTAL KELUAR</p>
              <p style={{ fontSize: '13px', fontWeight: '900', color: '#e74c3c' }}>Rp {totalKeluar.toLocaleString('id-ID')}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '5px', marginBottom: '6px' }}>
            <select value={finTipe} onChange={(e) => setFinTipe(e.target.value as any)} style={{ padding: '6px', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold', background: '#fff', border: '1px solid #a29bfe' }}>
              <option value="nabung">➕ Nabung</option>
              <option value="pengeluaran">➖ Keluar</option>
            </select>
            <input type="number" value={finJml} onChange={(x) => setFinJml(x.target.value)} placeholder="Nominal..." style={{ width: '100%', padding: '6px 8px', borderRadius: '8px', border: '1px solid #a29bfe', fontSize: '10px', outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', gap: '5px', marginBottom: '6px' }}>
            <input type="text" value={finKet} onChange={(x) => setFinKet(x.target.value)} placeholder="Keterangan..." style={{ width: '100%', padding: '6px 8px', borderRadius: '8px', border: '1px solid #a29bfe', fontSize: '10px', outline: 'none' }} />
            <input type="date" value={finTgl} onChange={(x) => setFinTgl(x.target.value)} style={{ padding: '6px', borderRadius: '8px', border: '1px solid #a29bfe', fontSize: '9px', background: '#fff' }} />
            <button onClick={tambahFinance} style={{ background: '#6c5ce7', color: '#fff', border: 'none', borderRadius: '8px', padding: '0 10px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Tambah</button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '9px', fontWeight: 'bold' }}>Filter Bulan:</span>
            <input type="month" value={bulanFilter === 'semua' ? '' : bulanFilter} onChange={(e) => setBulanFilter(e.target.value || 'semua')} style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '9px', border: '1px solid #a29bfe' }} />
            {bulanFilter !== 'semua' && <button onClick={() => setBulanFilter('semua')} style={{ fontSize: '8px', background: '#cbd5e1', border: 'none', padding: '3px 6px', borderRadius: '4px' }}>Reset</button>}
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px', overflowY: 'auto' }}>
            {filteredFinance.map(f => (
              <div key={f.id} style={{ background: '#fff', padding: '8px 10px', borderRadius: '10px', border: '1px solid #a29bfe', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '10px', fontWeight: 'bold', color: f.tipe === 'nabung' ? '#00b894' : '#e74c3c' }}>
                    {f.tipe === 'nabung' ? '+' : '-'} Rp {Number(f.jumlah).toLocaleString('id-ID')} ({f.tipe.toUpperCase()})
                  </p>
                  <p style={{ fontSize: '8px', color: '#555' }}>{f.keterangan} • 📅 {f.createdAt || 'Baru'} • 👤 {f.senderId}</p>
                </div>
                <button onClick={() => del('CoupleFinance', f.id)} style={{ background: '#ff4757', color: '#fff', border: 'none', borderRadius: '50%', width: '16px', height: '16px', fontSize: '7px' }}>✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'diary' && (
        <div style={{ width: '100%', maxWidth: '380px', background: themeCard, padding: '16px', borderRadius: '22px', display: 'flex', flexDirection: 'column', height: '460px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#e84393', marginBottom: '8px', borderBottom: '1px solid #ffb6c1', paddingBottom: '6px' }}>📖 LOVE DIARY & SECRET VAULT</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '8px', background: '#fff0f5', padding: '8px', borderRadius: '12px' }}>
            <input type="text" value={judulDiary} onChange={(x) => setJudulDiary(x.target.value)} placeholder="Judul cerita hari ini..." style={{ width: '100%', padding: '6px 8px', borderRadius: '8px', border: '1px solid #ffb6c1', fontSize: '10px', outline: 'none' }} />
            <textarea value={isiDiary} onChange={(x) => setIsiDiary(x.target.value)} placeholder="Tulis kenangan manis, uneg-uneg, atau cerita berdua di sini..." style={{ width: '100%', height: '50px', padding: '6px 8px', borderRadius: '8px', border: '1px solid #ffb6c1', fontSize: '10px', outline: 'none', resize: 'none' }} />
            <button onClick={tambahDiary} style={{ background: '#e84393', color: '#fff', border: 'none', borderRadius: '8px', padding: '6px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Simpan di Diary 📖</button>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto' }}>
            {diaryList.map(d => (
              <div key={d.id} style={{ background: '#fff', padding: '10px', borderRadius: '12px', border: '1px solid #ffb6c1', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#e84393' }}>📖 {d.judul}</p>
                  <button onClick={() => del('LoveDiary', d.id)} style={{ background: '#ff4757', color: '#fff', border: 'none', borderRadius: '50%', width: '16px', height: '16px', fontSize: '7px' }}>✕</button>
                </div>
                <p style={{ fontSize: '10px', color: '#444', marginTop: '4px', lineHeight: '1.4' }}>{d.isi}</p>
                <p style={{ fontSize: '7px', color: '#777', marginTop: '4px', textAlign: 'right' }}>👤 Oleh: {d.senderId}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'nobar' && (
        <div style={{ width: '100%', maxWidth: '380px', background: themeCard, padding: '14px', borderRadius: '22px', display: 'flex', flexDirection: 'column', height: '440px' }}>
          <h3 style={{ fontSize: '11px', fontWeight: 'bold', color: '#d63031', marginBottom: '6px', borderBottom: '1px solid #ff7675', paddingBottom: '4px' }}>🎬 NOBAR REALTIME</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '8px', background: '#ffeaa7', padding: '10px', borderRadius: '14px' }}>
            <input type="text" value={judulNobar} onChange={(x) => setJudulNobar(x.target.value)} placeholder="Judul Film/Web..." style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid #fdcb6e', fontSize: '11px', outline: 'none' }} />
            <input type="text" value={inputWebNobar} onChange={(x) => setInputWebNobar(x.target.value)} placeholder="Link web/film (https://...)..." style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid #fdcb6e', fontSize: '11px', outline: 'none' }} />
            <button onClick={mulaiNobarWeb} style={{ background: '#d63031', color: '#fff', border: 'none', borderRadius: '8px', padding: '7px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>Mulai Nobar Berdua 🎬</button>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            {nobarList.length === 0 ? <p style={{ fontSize: '11px', color: '#888', textAlign: 'center', margin: 'auto' }}>Belum ada web/film yang diputar.</p> : nobarList.map((nb) => (<div key={nb.id} style={{ background: '#fff', padding: '10px', borderRadius: '14px', border: '1px solid #ff7675', display: 'flex', flexDirection: 'column', height: '100%' }}><p style={{ fontSize: '12px', fontWeight: 'bold', color: '#d63031', marginBottom: '6px' }}>▶️ {nb.judul}</p><iframe src={nb.url} style={{ flex: 1, width: '100%', height: '220px', border: 'none', borderRadius: '10px' }} allow="autoplay; encrypted-media; fullscreen" allowFullScreen></iframe></div>))}
          </div>
        </div>
      )}

      {tab === 'game' && (
        <div style={{ width: '100%', maxWidth: '380px', background: themeCard, padding: '16px', borderRadius: '22px', display: 'flex', flexDirection: 'column', height: '460px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#e17055', marginBottom: '8px', borderBottom: '1px solid #fab1a0', paddingBottom: '4px' }}>🎮 MINI GAMES VS ONLINE</h3>
          
          <div style={{ display: 'flex', gap: '4px', marginBottom: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
            <button onClick={() => setGameSubTab('kangen')} style={{ padding: '5px 10px', borderRadius: '8px', border: 'none', fontSize: '9px', fontWeight: 'bold', background: gameSubTab === 'kangen' ? '#e17055' : '#fff', color: gameSubTab === 'kangen' ? '#fff' : '#555', cursor: 'pointer' }}>💕 Skor Kangen</button>
            <button onClick={() => setGameSubTab('bkg')} style={{ padding: '5px 10px', borderRadius: '8px', border: 'none', fontSize: '9px', fontWeight: 'bold', background: gameSubTab === 'bkg' ? '#0284c7' : '#fff', color: gameSubTab === 'bkg' ? '#fff' : '#555', cursor: 'pointer' }}>✊ BKG</button>
            <button onClick={() => setGameSubTab('ttt')} style={{ padding: '5px 10px', borderRadius: '8px', border: 'none', fontSize: '9px', fontWeight: 'bold', background: gameSubTab === 'ttt' ? '#9333ea' : '#fff', color: gameSubTab === 'ttt' ? '#fff' : '#555', cursor: 'pointer' }}>❌ Tic Tac Toe</button>
            <button onClick={() => setGameSubTab('congklak')} style={{ padding: '5px 10px', border: '1px solid #55efc4', fontSize: '9px', fontWeight: 'bold', background: gameSubTab === 'congklak' ? '#00b894' : '#fff', color: gameSubTab === 'congklak' ? '#fff' : '#555', cursor: 'pointer' }}>🪵 Congklak</button>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', overflowY: 'auto' }}>
            
            {gameSubTab === 'kangen' && (
              <div style={{ width: '100%', background: '#fff0f3', padding: '25px', borderRadius: '20px', border: '2px solid #ffb6c1' }}>
                <div style={{ fontSize: '50px', marginBottom: '10px' }}>🥺❤️</div>
                <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: '#ff4757', marginBottom: '15px' }}>SIAPA PALING KANGEN?</h4>
                <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px', fontSize: '13px' }}>
                  <span>🐻 Amack: <b>{skorAmack}</b></span>
                  <span>🐼 Rifa: <b>{skorRifa}</b></span>
                </div>
                <button onClick={tambahSkorKangen} style={{ padding: '12px 24px', background: '#ff4757', color: '#fff', border: 'none', borderRadius: '14px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(255,71,87,0.3)' }}>Tambah Kangenku! 💕</button>
              </div>
            )}

            {gameSubTab === 'bkg' && (
              <div style={{ width: '100%', background: '#f0f9ff', padding: '20px', borderRadius: '20px', border: '2px solid #bae6fd' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: '#0284c7', marginBottom: '15px' }}>✊ ✋ ✌️ BATU KERTAS GUNTING</h4>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '15px' }}>
                  <button onClick={() => pilihBKG('batu')} style={{ padding: '10px 16px', background: '#fff', border: '2px solid #0284c7', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>Batu ✊</button>
                  <button onClick={() => pilihBKG('kertas')} style={{ padding: '10px 16px', background: '#fff', border: '2px solid #0284c7', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>Kertas ✋</button>
                  <button onClick={() => pilihBKG('gunting')} style={{ padding: '10px 16px', background: '#fff', border: '2px solid #0284c7', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>Gunting ✌️</button>
                </div>
                <p style={{ fontSize: '11px', color: '#555', marginBottom: '10px' }}>Amack: {bkgData.amack ? '✅ Pilih' : '⏳ Menunggu'} | Rifa: {bkgData.rifa ? '✅ Pilih' : '⏳ Menunggu'}</p>
                {bkgData.hasil && <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#10b981', marginBottom: '15px' }}>{bkgData.hasil}</p>}
                <button onClick={resetBKG} style={{ fontSize: '10px', background: '#cbd5e1', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Reset Permainan</button>
              </div>
            )}

            {gameSubTab === 'ttt' && (
              <div style={{ width: '100%', background: '#faf5ff', padding: '20px', borderRadius: '20px', border: '2px solid #e9d5ff' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: '#9333ea', marginBottom: '10px' }}>❌ ⭕ TIC TAC TOE (Giliran: {tttData.turn.toUpperCase()})</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', width: '180px', margin: '0 auto 15px auto' }}>
                  {tttData.board.map((val: string, idx: number) => (
                    <button key={idx} onClick={() => playTTT(idx)} style={{ height: '50px', background: '#fff', border: '2px solid #9333ea', fontSize: '20px', fontWeight: 'bold', borderRadius: '10px', cursor: 'pointer' }}>{val}</button>
                  ))}
                </div>
                {tttData.winner && <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#ff4757', marginBottom: '10px' }}>{tttData.winner}</p>}
                <button onClick={resetTTT} style={{ fontSize: '10px', background: '#cbd5e1', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Reset Papan</button>
              </div>
            )}

            {gameSubTab === 'congklak' && (
              <div style={{ width: '100%', background: '#e8f8f5', padding: '15px', borderRadius: '20px', border: '2px solid #55efc4' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: '#00b894', marginBottom: '4px' }}>🪵 CONGLAK (REALTIME ANIMASI)</h4>
                <p style={{ fontSize: '9px', color: '#444', marginBottom: '8px' }}>Giliran: <b>{congklakData.turn.toUpperCase()}</b> {animasiPesanInfo && <span style={{ color: '#e67e22', fontWeight: 'bold' }}>({animasiPesanInfo})</span>}</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <div style={{ width: '28px', height: '60px', background: '#00b894', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold' }}>{congklakData.board[15]}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px' }}>
                      {congklakData.board.slice(8, 15).map((biji: number, i: number) => {
                        const idxReal = i + 8;
                        return (
                          <button key={idxReal} onClick={() => playCongklakWithAnimation(idxReal)} disabled={isCongklakAnimating} style={{ width: '32px', height: '32px', background: '#fff', border: '1px solid #00b894', borderRadius: '50%', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span>🪨{biji}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px' }}>
                      {congklakData.board.slice(0, 7).map((biji: number, i: number) => {
                        return (
                          <button key={i} onClick={() => playCongklakWithAnimation(i)} disabled={isCongklakAnimating} style={{ width: '32px', height: '32px', background: '#fff', border: '1px solid #ff4757', borderRadius: '50%', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span>🪨{biji}</span>
                          </button>
                        );
                      })}
                    </div>
                    <div style={{ width: '28px', height: '60px', background: '#ff4757', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold' }}>{congklakData.board[7]}</div>
                  </div>
                </div>

                {congklakData.winner && <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#ff4757', marginBottom: '6px' }}>{congklakData.winner}</p>}
                <button onClick={resetCongklak} disabled={isCongklakAnimating} style={{ fontSize: '9px', background: '#cbd5e1', border: 'none', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Reset Congklak</button>
              </div>
            )}

          </div>
        </div>
      )}

      {tab === 'theme' && (
        <div style={{ width: '100%', maxWidth: '380px', background: themeCard, padding: '16px', borderRadius: '22px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', height: '440px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', overflowY: 'auto' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#ff4757', marginBottom: '10px', borderBottom: '1px solid #ffd1dc', width: '100%', paddingBottom: '6px' }}>🎨 TEMA & MOTIF ESTETIK (ULTIMATE)</h3>
          <p style={{ fontSize: '10px', color: '#555', marginBottom: '10px' }}>Pilih dari 10+ pilihan warna kesukaan kamu ({u}):</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', width: '100%', marginBottom: '15px' }}>
            <button onClick={() => simpanTema('#ff9a9e', 'rgba(255,255,255,0.9)', 'none')} style={{ padding: '9px', background: '#ff9a9e', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>💖 Pink Sunset</button>
            <button onClick={() => simpanTema('#a1c4fd', 'rgba(255,255,255,0.9)', 'none')} style={{ padding: '9px', background: '#a1c4fd', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>🌊 Ocean Blue</button>
            <button onClick={() => simpanTema('#00b894', 'rgba(255,255,255,0.9)', 'none')} style={{ padding: '9px', background: '#00b894', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>🌿 Emerald Mint</button>
            <button onClick={() => simpanTema('#6c5ce7', 'rgba(255,255,255,0.9)', 'none')} style={{ padding: '9px', background: '#6c5ce7', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>🔮 Lavender Dream</button>
            <button onClick={() => simpanTema('#e17055', 'rgba(255,255,255,0.9)', 'none')} style={{ padding: '9px', background: '#e17055', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>🔥 Sunset Orange</button>
            <button onClick={() => simpanTema('#fd79a8', 'rgba(255,255,255,0.9)', 'none')} style={{ padding: '9px', background: '#fd79a8', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>🌸 Barbie Pink</button>
            <button onClick={() => simpanTema('#2d3436', 'rgba(40,40,40,0.9)', 'none')} style={{ padding: '9px', background: '#2d3436', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>🌙 Dark Night</button>
            <button onClick={() => simpanTema('#d63031', 'rgba(255,255,255,0.9)', 'none')} style={{ padding: '9px', background: '#d63031', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>❤️ Ruby Red</button>
            <button onClick={() => simpanTema('#0984e3', 'rgba(255,255,255,0.9)', 'none')} style={{ padding: '9px', background: '#0984e3', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>💙 Royal Blue</button>
            <button onClick={() => simpanTema('#fdcb6e', 'rgba(255,255,255,0.95)', 'none')} style={{ padding: '9px', background: '#fdcb6e', color: '#333', border: 'none', borderRadius: '10px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>☀️ Golden Sunshine</button>
          </div>
          <p style={{ fontSize: '9px', color: '#777', fontStyle: 'italic' }}>*Tersimpan otomatis khusus untuk akun kamu ({u})!</p>
        </div>
      )}

      {/* NAVIGASI BAWAH */}
      <nav style={{ position: 'fixed', bottom: '12px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(15px)', padding: '8px 10px', borderRadius: '30px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', display: 'flex', gap: '4px', zIndex: 50, overflowX: 'auto', maxWidth: '98%', whiteSpace: 'nowrap' }}>
        <button onClick={() => setTab('chat')} style={{ padding: '8px 8px', borderRadius: '14px', border: 'none', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer', ...(tab === 'chat' ? { background: '#ff4757', color: '#fff' } : { background: 'transparent', color: '#555' }) }}>💬 Chat</button>
        <button onClick={() => setTab('ai')} style={{ padding: '8px 8px', borderRadius: '14px', border: 'none', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer', ...(tab === 'ai' ? { background: '#0984e3', color: '#fff' } : { background: 'transparent', color: '#555' }) }}>🤖 AI</button>
        <button onClick={() => setTab('foto')} style={{ padding: '8px 8px', borderRadius: '14px', border: 'none', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer', ...(tab === 'foto' ? { background: '#9333ea', color: '#fff' } : { background: 'transparent', color: '#555' }) }}>📸 Foto</button>
        <button onClick={() => setTab('musik')} style={{ padding: '8px 8px', borderRadius: '14px', border: 'none', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer', ...(tab === 'musik' ? { background: '#0284c7', color: '#fff' } : { background: 'transparent', color: '#555' }) }}>🎵 Musik</button>
        <button onClick={() => setTab('surat')} style={{ padding: '8px 8px', borderRadius: '14px', border: 'none', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer', ...(tab === 'surat' ? { background: '#e84393', color: '#fff' } : { background: 'transparent', color: '#555' }) }}>💌 Surat</button>
        <button onClick={() => setTab('wishlist')} style={{ padding: '8px 8px', borderRadius: '14px', border: 'none', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer', ...(tab === 'wishlist' ? { background: '#00b894', color: '#fff' } : { background: 'transparent', color: '#555' }) }}>✨ Wish</button>
        <button onClick={() => setTab('finance')} style={{ padding: '8px 8px', borderRadius: '14px', border: 'none', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer', ...(tab === 'finance' ? { background: '#6c5ce7', color: '#fff' } : { background: 'transparent', color: '#555' }) }}>💳 Kas</button>
        <button onClick={() => setTab('diary')} style={{ padding: '8px 8px', borderRadius: '14px', border: 'none', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer', ...(tab === 'diary' ? { background: '#e84393', color: '#fff' } : { background: 'transparent', color: '#555' }) }}>📖 Diary</button>
        <button onClick={() => setTab('nobar')} style={{ padding: '8px 8px', borderRadius: '14px', border: 'none', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer', ...(tab === 'nobar' ? { background: '#d63031', color: '#fff' } : { background: 'transparent', color: '#555' }) }}>🎬 Nobar</button>
        <button onClick={() => setTab('game')} style={{ padding: '8px 8px', borderRadius: '14px', border: 'none', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer', ...(tab === 'game' ? { background: '#e17055', color: '#fff' } : { background: 'transparent', color: '#555' }) }}>🎮 Game</button>
        <button onClick={() => setTab('theme')} style={{ padding: '8px 8px', borderRadius: '14px', border: '1px solid #ddd', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer', ...(tab === 'theme' ? { background: '#0984e3', color: '#fff' } : { background: 'transparent', color: '#555' }) }}>🎨 Tema</button>
      </nav>
    </div>
  );
      }
