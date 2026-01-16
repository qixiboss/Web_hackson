/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import formatDate from '@/lib/utils/formatDate'
import { PostFrontMatter } from 'types/PostFrontMatter'

export default function Article({ slug, date, title, summary, tags, images }: PostFrontMatter) {
  const src = Array.isArray(images) ? images[0] : images
  const [showShare, setShowShare] = useState(false)
  
  // 文章链接
  const url = typeof window !== 'undefined' ? `${window.location.origin}/blog/${slug}` : `https://example.com/blog/${slug}`
  
  // 分享链接配置
  const shareLinks = {
    xiaohongshu: `https://www.xiaohongshu.com/explore`,
    weibo: `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    wechat: url,
  }
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      alert('链接已复制到剪贴板！')
    } catch (err) {
      console.error('Failed to copy:', err)
      const tempInput = document.createElement('input')
      tempInput.value = url
      document.body.appendChild(tempInput)
      tempInput.select()
      document.execCommand('copy')
      document.body.removeChild(tempInput)
      alert('链接已复制到剪贴板！')
    }
  }
  
  return (
    <li className="py-12">
      <article>
        <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-start xl:gap-5 xl:space-y-0">
          <dl className="xl:col-span-1">
            {src ? (
              <dt className="mb-4">
                <Link
                  href={`/blog/${slug}`}
                  className="block overflow-hidden rounded shadow-lg"
                  title={title}
                >
                  <img
                    alt={title}
                    className="transform  object-cover duration-200 hover:scale-110"
                    src={src}
                  />
                </Link>
              </dt>
            ) : null}
            <dd className="sr-only">发布时间</dd>
            <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
              <time dateTime={date}>{formatDate(date)}</time>
            </dd>
          </dl>
          <div className="space-y-4 xl:col-span-3">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold leading-8 tracking-tight">
                  <Link href={`/blog/${slug}`} className="text-gray-900 dark:text-gray-100">
                    {title}
                  </Link>
                </h2>
                {/* 分享按钮 */}
                <div className="relative">
                  <button
                    onClick={() => setShowShare(!showShare)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                    aria-label="分享"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                    </svg>
                  </button>
                  
                  {/* 分享选项 */}
                  {showShare && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-2 z-50 border border-gray-200 dark:border-gray-700">
                      <div className="flex justify-around items-center p-3">
                        {/* 小红书分享 */}
                        <a
                          href={shareLinks.xiaohongshu}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center justify-center transition-all duration-200 hover:scale-110 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                          aria-label="分享到小红书"
                          onClick={() => setShowShare(false)}
                        >
                          <img
                            src="/static/images/xiaohongshu.svg"
                            alt="小红书"
                            className="h-6 w-6 object-contain"
                          />
                        </a>
                        
                        {/* 微博分享 */}
                        <a
                          href={shareLinks.weibo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center justify-center transition-all duration-200 hover:scale-110 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                          aria-label="分享到微博"
                          onClick={() => setShowShare(false)}
                        >
                          <img
                            src="/static/images/sinaweibo.svg"
                            alt="微博"
                            className="h-6 w-6 object-contain"
                          />
                        </a>
                        
                        {/* 微信分享 */}
                        <div className="relative group">
                          <button
                            className="flex flex-col items-center justify-center transition-all duration-200 hover:scale-110 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                            aria-label="分享到微信"
                          >
                            <img
                              src="/static/images/wechat.svg"
                              alt="微信"
                              className="h-6 w-6 object-contain"
                            />
                          </button>
                          {/* 微信二维码 */}
                          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3 border border-gray-200 dark:border-gray-700 min-w-[180px]">
                              <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&margin=0&data=${encodeURIComponent(url)}`} 
                                alt="微信分享二维码" 
                                className="w-full h-auto object-cover rounded mx-auto"
                                style={{ width: '150px', height: '150px', display: 'block' }}
                              />
                              <p className="text-xs text-center mt-2 text-gray-500 dark:text-gray-400">扫码分享到微信</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* 复制链接 */}
                        <button
                          onClick={() => {
                            copyToClipboard()
                            setShowShare(false)
                          }}
                          className="flex flex-col items-center justify-center transition-all duration-200 hover:scale-110 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                          aria-label="复制链接"
                        >
                          <svg className="h-6 w-6 text-gray-700 dark:text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap">
                {tags.map((tag) => (
                  <Tag key={tag} text={tag} />
                ))}
              </div>
            </div>
            <div className="prose max-w-none text-gray-500 dark:text-gray-400">{summary}</div>
          </div>
          <div className="text-base font-medium leading-6">
            <Link
              href={`/blog/${slug}`}
              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
              aria-label={`Read "${title}"`}
            >
              查看更多 &rarr;
            </Link>
          </div>
        </div>
      </article>
    </li>
  )
}
