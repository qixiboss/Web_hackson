import React, { useState, useEffect } from 'react'
import siteMetadata from '@/data/siteMetadata'

interface ShareButtonsProps {
  title: string
  slug: string
}

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  // 检测设备类型
  useEffect(() => {
    const checkMobile = () => {
      // 检测是否为移动端设备
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
      setIsMobile(mobileRegex.test(navigator.userAgent))
    }
    
    checkMobile()
    // 监听窗口大小变化，处理设备旋转等情况
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // 使用导航栏的链接，即当前页面的完整URL
  const url = typeof window !== 'undefined' ? window.location.href : `${siteMetadata.siteUrl}/blog/${slug}`
  
  // 分享链接配置
  const shareLinks = {
    // 小红书分享 - 移动端使用应用协议，桌面端使用网页链接
    xiaohongshu: isMobile 
      ? `xiaohongshu://share?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}` 
      : `https://www.xiaohongshu.com/explore`,
    // 微博分享 - 移动端使用应用协议，桌面端使用网页链接
    weibo: isMobile 
      ? `sinaweibo://share?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}` 
      : `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    // 微信分享 - 移动端使用应用协议，桌面端显示二维码
    wechat: isMobile 
      ? `weixin://share?url=${encodeURIComponent(url)}` 
      : url,
  }
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
      // 降级方案：创建临时输入框复制
      const tempInput = document.createElement('input')
      tempInput.value = url
      document.body.appendChild(tempInput)
      tempInput.select()
      document.execCommand('copy')
      document.body.removeChild(tempInput)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }
  
  return (
    <div className="pt-6 pb-8">
      <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">
        分享文章
      </h3>
      <div className="flex items-center space-x-6">
        {/* 小红书分享 */}
        <a
          href={shareLinks.xiaohongshu}
          target={isMobile ? '_self' : '_blank'}
          rel={isMobile ? '' : 'noopener noreferrer'}
          className="flex flex-col items-center justify-center transition-all duration-200 hover:scale-110"
          aria-label="分享到小红书"
        >
          <img
            src="/static/images/xiaohongshu.svg"
            alt="小红书"
            className="h-10 w-10 object-contain"
          />
          <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">小红书</span>
        </a>
        
        {/* 微博分享 */}
        <a
          href={shareLinks.weibo}
          target={isMobile ? '_self' : '_blank'}
          rel={isMobile ? '' : 'noopener noreferrer'}
          className="flex flex-col items-center justify-center transition-all duration-200 hover:scale-110"
          aria-label="分享到微博"
        >
          <img
            src="/static/images/sinaweibo.svg"
            alt="微博"
            className="h-10 w-10 object-contain"
          />
          <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">微博</span>
        </a>
        
        {/* 微信分享 - 移动端直接跳转，桌面端显示二维码 */}
        {isMobile ? (
          <a
            href={shareLinks.wechat}
            target="_self"
            className="flex flex-col items-center justify-center transition-all duration-200 hover:scale-110"
            aria-label="分享到微信"
          >
            <img
              src="/static/images/wechat.svg"
              alt="微信"
              className="h-10 w-10 object-contain"
            />
            <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">微信</span>
          </a>
        ) : (
          <div className="relative group flex flex-col items-center justify-center">
            <button 
              className="flex flex-col items-center justify-center transition-all duration-200 hover:scale-110"
              aria-label="微信分享"
            >
              <img
                src="/static/images/wechat.svg"
                alt="微信"
                className="h-10 w-10 object-contain"
              />
              <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">微信</span>
            </button>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-gray-100 dark:border-gray-700 p-4 flex flex-col items-center min-w-[250px]">
                <div className="bg-white p-3 rounded-lg border border-gray-200 dark:border-gray-600 mb-2">
                  {/* 确保图片是正方形且清晰 */}
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=0&data=${encodeURIComponent(url)}`} 
                    alt="微信分享二维码" 
                    className="w-full h-auto object-cover rounded mx-auto"
                    style={{ width: '200px', height: '200px', display: 'block' }}
                  />
                </div>
                <p className="text-sm font-medium text-center text-gray-700 dark:text-gray-300 mb-1">扫码分享到微信</p>
                <p className="text-xs text-center text-gray-500 dark:text-gray-400">长按图片可保存或分享</p>
              </div>
              {/* 三角形指示符 */}
              <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-100 dark:border-t-gray-700"></div>
              <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-0 h-0 mt-0.5 border-l-3 border-l-transparent border-r-3 border-r-transparent border-t-3 border-t-white dark:border-t-gray-800"></div>
            </div>
          </div>
        )}
        
        {/* 复制链接 */}
        <button
          onClick={copyToClipboard}
          className="flex flex-col items-center justify-center transition-all duration-200 hover:scale-110"
          aria-label="复制链接"
        >
          <svg className="h-10 w-10 text-gray-700 dark:text-gray-300" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
          </svg>
          <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">复制链接</span>
        </button>
      </div>
      {copied && (
        <div className="mt-4 flex items-center justify-center">
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 shadow-md">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            链接已复制到剪贴板！
          </span>
        </div>
      )}
    </div>
  )
}
