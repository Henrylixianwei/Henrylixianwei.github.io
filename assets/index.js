function showSection(sectionId) {
  // 隐藏所有内容区块
  document.querySelectorAll('.content-section').forEach(section => {
    section.classList.remove('active-section')
  })

  // 显示目标区块
  document.getElementById(sectionId).classList.add('active-section')

  // 更新菜单激活状态
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active')
  })

  event.target.classList.add('active')

  if (getComputedStyle(document.querySelectorAll('.collapsed-menu')[0]).display !== 'none') {
    toggleNav()
  }
}

// 显示弹框（添加动画）
/*
  title: 标题
  path：图片路径
  multiple: 是否多张图片
  count：图片数量
  suffix：图片格式
*/
let mySwiper = null

function showModal(title, path, multiple, count) {
  // 加载图片
  document.querySelectorAll('#mask .modal-header-title')[0].textContent = title + '333'

  if (multiple && count) {
    // 创建外层容器
    const swiperContainer = document.createElement('div')
    swiperContainer.className = 'swiper'

    // 创建 swiper-wrapper
    const swiperWrapper = document.createElement('div')
    swiperWrapper.className = 'swiper-wrapper'

    // 批量创建 slides
    const fragment = document.createDocumentFragment()

    for (let i = 0; i < count; i++) {
      // 创建 slide 容器
      const slide = document.createElement('div')
      slide.className = 'swiper-slide';

      // 创建图片
      const img = document.createElement('img')
      img.className = 'swiper-lazy'
      img.setAttribute('data-src', `./projects/${path}/${path + (i + 1)}.webp`)

      // 创建预加载器
      const preloader = document.createElement('div')
      preloader.className = 'swiper-lazy-preloader'

      // 组装元素
      slide.appendChild(img)
      slide.appendChild(preloader)
      fragment.appendChild(slide)
    }

    swiperWrapper.appendChild(fragment)

    // 创建分页器
    const pagination = document.createElement('div')
    pagination.className = 'swiper-pagination'

    // 组装完整结构
    swiperContainer.appendChild(swiperWrapper)
    swiperContainer.appendChild(pagination)

    const modalContainer = document.getElementById('modal-container')
    modalContainer.appendChild(swiperContainer)

    // 初始化swiper
    mySwiper = new Swiper('.swiper', {
      direction: 'horizontal', // 垂直切换选项
      loop: false, // 循环模式选项
      // 如果需要分页器
      pagination: {
        clickable: true,
        dynamicBullets: false,
        dynamicMainBullets: 1,
        el: '.swiper-pagination'
      },
      preloadImages: true,
      lazy: {
        loadPrevNext: true
      }
    })
  } else {
    // 创建图片
    const img = document.createElement('img')
    img.className = 'preview-image'
    img.setAttribute('src', `./projects/${path}`)

    const objectFitStyle = multiple
    if (multiple) {
      img.style.objectFit = objectFitStyle
    }

    const modalContainer = document.getElementById('modal-container')
    modalContainer.appendChild(img)
  }

  const mask = document.getElementById('mask')
  mask.classList.add('active')
  document.body.style.overflow = 'hidden' // 防止背景滚动
  // document.body.style.touchAction = 'none' // 图片无法缩放了

  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  document.body.style.position = 'fixed'
  document.body.style.top = `-${scrollTop}px`
  document.body.style.width = '100%'
}

// 隐藏弹框（添加动画）
function hideModal() {
  mySwiper = null
  const modalContainer = document.getElementById('modal-container')
  const fragment = document.createDocumentFragment()
  modalContainer.replaceChildren(fragment)

  const mask = document.getElementById('mask')
  mask.classList.remove('active')
  document.body.style.overflow = 'auto' // 恢复滚动
  // document.body.style.touchAction = 'auto'

  const scrollTop = parseInt(document.body.style.top || '0');
  document.body.style.overflow = ''
  document.body.style.position = ''
  document.body.style.top = ''
  window.scrollTo(0, Math.abs(scrollTop))

  // 动画结束后完全隐藏
  mask.addEventListener('transitionend', function handler() {
    mask.removeEventListener('transitionend', handler)
  })
}

// 点击遮罩层关闭
document.getElementById('mask').addEventListener('click', function(e) {
  if (e.target === this) {
    hideModal()
  }
})

// 按ESC键关闭
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    hideModal()
  }
})

function openLink(link) {
  window.open(link, '_blank')
  event.stopPropagation()
}

let navVisible = false

function toggleNav() {
  navVisible = !navVisible
  if (navVisible) {
    document.querySelectorAll('.sidebar')[0].style.display = 'flex'
  } else {
    document.querySelectorAll('.sidebar')[0].removeAttribute('style')
  }
}

// 使用 Intersection Observer API 实现
document.addEventListener('DOMContentLoaded', function() {
  const lazyImages = document.querySelectorAll('.lazy-img')

  // 创建观察器
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target

        const loadImg = new Image()
        loadImg.src = img.dataset.src
        loadImg.onload = function() {
          img.src = img.dataset.src
          img.classList.add('loaded')
          observer.unobserve(img) // 停止观察已加载的图片
        }
      }
    })
  }, {
    root: null, // 相对于视口
    rootMargin: '0px', // 不扩展观察区域
    threshold: 0.01 // 轻微交叉即触发
  })

  // 观察所有图片元素
  lazyImages.forEach(img => {
    observer.observe(img)
  })
})