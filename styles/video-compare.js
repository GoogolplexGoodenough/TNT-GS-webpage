window.addEventListener('load', () => {
  const containers = document.querySelectorAll('.video-container');

  containers.forEach(container => {
    const videos = Array.from(container.querySelectorAll('.vc-video'));
    const dividers = Array.from(container.querySelectorAll('.vc-divider'));
    const labels = Array.from(container.querySelectorAll('.vc-label'));

    const count = videos.length;
    if (dividers.length !== count - 1 || labels.length !== count) {
      console.warn("✋ 视频数量、分界线、标签数量不匹配！");
    }

    function updateClips() {
      const width = container.offsetWidth;

      const positions = dividers.map(div => div.offsetLeft);
      positions.unshift(0);
      positions.push(width);

      for (let i = 0; i < count; i++) {
        const left = positions[i];
        const right = positions[i + 1];

        videos[i].style.clipPath = `inset(0 ${width - right}px 0 ${left}px)`;
        const mid = (left + right) / 2;
        labels[i].style.left = `${mid}px`;
      }
    }

    // 拖动逻辑仅绑定当前 container 的 divider
    let activeDivider = null;

    dividers.forEach((divider, i) => {
      divider.addEventListener('mousedown', () => {
        activeDivider = { element: divider, index: i };
        document.body.style.cursor = 'col-resize';
      });
    });

    document.addEventListener('mouseup', () => {
      activeDivider = null;
      document.body.style.cursor = 'default';
    });

    // document.addEventListener('mousemove', e => {
    //   if (!activeDivider) return;

    //   const rect = container.getBoundingClientRect();
    //   const x = e.clientX - rect.left;
    //   const index = activeDivider.index;

    //   const prev = index === 0 ? 0 : dividers[index - 1].offsetLeft + 30;
    //   const next = index === dividers.length - 1 ? rect.width : dividers[index + 1].offsetLeft - 30;

    //   const clamped = Math.max(prev, Math.min(next, x));
    //   activeDivider.element.style.left = `${clamped}px`;

    //   updateClips();
    // });

    document.addEventListener('mousemove', e => {
      if (!activeDivider) return;

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const index = activeDivider.index;

      function moveDivider(idx, newX) {
        const minGap = 30;

        // 推动右侧 divider（向右推）
        if (idx < dividers.length - 1) {
          const nextX = dividers[idx + 1].offsetLeft;
          if (newX + minGap > nextX) {
            moveDivider(idx + 1, newX + minGap);
          }
        }

        // 推动左侧 divider（向左推）
        if (idx > 0) {
          const prevX = dividers[idx - 1].offsetLeft;
          if (newX - minGap < prevX) {
            moveDivider(idx - 1, newX - minGap);
          }
        }

        // 边界限制
        const minX = idx === 0 ? 0 : dividers[idx - 1].offsetLeft + minGap;
        const maxX = idx === dividers.length - 1 ? rect.width : dividers[idx + 1].offsetLeft - minGap;
        const finalX = Math.max(minX, Math.min(maxX, newX));

        dividers[idx].style.left = `${finalX}px`;
      }

      moveDivider(index, x);
      updateClips();
    });



    window.addEventListener('resize', updateClips);
    updateClips();
  });
});
