document.addEventListener('DOMContentLoaded', function () {
    // 遍历每个对比滑动组件
    document.querySelectorAll('.comparison-slider').forEach(function (slider) {
      const handle = slider.querySelector('.handle');
      const img1 = slider.querySelector('img[data-type="first"]'); // 获取第一张图片
      const img2 = slider.querySelector('img[data-type="second"]'); // 获取第二张图片
  
      if (!img1 || !img2) {
        console.error('Both images with data-type="first" and data-type="second" are required');
        return;
      }
  
      handle.addEventListener('mousedown', function (e) {
        e.preventDefault();
        // 添加鼠标移动和释放事件
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });
  
      function onMouseMove(e) {
        const rect = slider.getBoundingClientRect();
        let x = e.clientX - rect.left;
  
        // 限制滑动条的移动范围
        if (x < 0) x = 0;
        if (x > rect.width) x = rect.width;
  
        const percentage = (x / rect.width) * 100;
  
        // 更新滑动条位置
        handle.style.left = `${percentage}%`;
  
        // 更新图片裁剪区域
        img1.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
        img2.style.clipPath = `inset(0 0 0 ${percentage}%)`;
      }
  
      function onMouseUp() {
        // 移除鼠标事件
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }
    });
  });