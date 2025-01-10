window.addEventListener('load', () => {
  const clickToEnter = document.querySelector('.click-to-enter');
  const container = document.querySelector('.container');
  const bgMusic = document.getElementById('bgMusic');
  const audioIcon = document.getElementById('audioIcon');
  const bgVideo = document.getElementById('bg-video');
  
  // เช็คว่าเป็น iOS หรือไม่
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  
  // สถานะเสียง
  let audioState = {
    isPlaying: false,
    audioContext: null,
    gainNode: null
  };

  // สร้าง Audio Context สำหรับ iOS
  const initAudioContext = () => {
    if (!audioState.audioContext) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioState.audioContext = new AudioContext();
      
      // สร้าง media element source
      const source = audioState.audioContext.createMediaElementSource(bgMusic);
      
      // สร้าง gain node สำหรับควบคุมเสียง
      audioState.gainNode = audioState.audioContext.createGain();
      
      // เชื่อมต่อ nodes
      source.connect(audioState.gainNode);
      audioState.gainNode.connect(audioState.audioContext.destination);
    }
  };

  // ฟังก์ชันควบคุมเสียง
  const toggleSound = async () => {
    if (!audioState.audioContext) {
      return;
    }

    if (audioState.isPlaying) {
      // ปิดเสียง
      audioState.gainNode.gain.value = 0;
      audioIcon.className = 'fas fa-volume-mute';
      if (isIOS) {
        await bgMusic.pause();
      }
    } else {
      // เปิดเสียง
      audioState.gainNode.gain.value = 1;
      audioIcon.className = 'fas fa-volume-up';
      if (isIOS) {
        await bgMusic.play();
      }
    }
    audioState.isPlaying = !audioState.isPlaying;
  };

  // เริ่มต้นการทำงานเมื่อกดปุ่ม Click to Enter
  clickToEnter.addEventListener('click', async () => {
    clickToEnter.style.display = 'none';
    container.style.display = 'block';
    
    try {
      // เริ่ม audio context
      initAudioContext();
      
      // รอให้ context พร้อม
      if (audioState.audioContext.state === 'suspended') {
        await audioState.audioContext.resume();
      }
      
      // เล่นวิดีโอและเสียง
      bgVideo.play().catch(console.warn);
      await bgMusic.play();
      
      // ตั้งค่าเริ่มต้น
      audioState.isPlaying = true;
      audioState.gainNode.gain.value = 1;
      audioIcon.className = 'fas fa-volume-up';
    } catch (error) {
      console.warn('Audio initialization failed:', error);
      audioIcon.className = 'fas fa-volume-mute';
      audioState.isPlaying = false;
    }

    setTimeout(() => {
      container.classList.add('fade-in');
    }, 100);
  });

  // ปุ่มควบคุมเสียง
  audioIcon.addEventListener('click', toggleSound);
});
