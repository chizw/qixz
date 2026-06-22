#!/usr/bin/env tsx

import fs from 'node:fs'
import path from 'node:path'

// 直接导入feeds.ts模块
import feedGroups from '../app/feeds'
import blogConfig from '../blog.config'

// 调试信息已移除

// 定义必要的接口
export interface Friend {
	title: string
	desc: string
	link: string
	linkpage?: string
	avatar: string
}

interface FeedEntry {
	author: string
	sitenick?: string
	title?: string
	link: string
	linkpage?: string
	avatar: string
	error?: string
}

interface FeedGroup {
	entries: FeedEntry[]
}

// 从feeds.ts生成friend.json
export function generateFcircleJson() {
	// 不想订阅的友链
	const blacklist = ['名称1', '名称2']

	// 跳过的分组（如『失联友友』）
	const skipGroups = ['『失联友友』']

	// 使用更可靠的方法获取当前文件目录
	const currentFileUrl = new URL(import.meta.url)
	const currentFilePath = currentFileUrl.protocol === 'file:'
		? decodeURIComponent(currentFileUrl.pathname).replace(/^\/(.:\/)/, '$1') // 修复Windows路径
		: currentFileUrl.pathname

	const __dirname = path.dirname(currentFilePath)
	const outputPath = path.resolve(__dirname, '../public/friend.json')

	try {
		// 提取有效友链数据
		const friends = feedGroups
			.filter(group => !skipGroups.includes(group.name)) // 跳过指定分组
			.flatMap(group =>
				group.entries
					.filter(entry => !entry.error) // 跳过有错误的条目
					.map((entry) => {
						const siteName = entry.title || entry.sitenick || entry.author
						// 跳过黑名单站点
						if (blacklist.includes(siteName)) {
							console.log(`跳过黑名单站点: ${siteName}`)
							return null
						}
					return [siteName, entry.link, entry.linkpage ?? '', entry.avatar]
					})
					.filter(Boolean) as [string, string, string, string][],
			)

		// 确保public目录存在并写入文件
		const publicDir = path.resolve(__dirname, '../public')
		if (!fs.existsSync(publicDir))
			fs.mkdirSync(publicDir, { recursive: true })

		const friendData = { friends }
		fs.writeFileSync(outputPath, JSON.stringify(friendData, null, 2), 'utf-8')

		console.log(`成功生成friend.json文件，共${friends.length}个友链`)
		console.log(`文件路径: ${outputPath}`)

		return friendData
	}
	catch (error) {
		console.error('生成friend.json时出错:', error instanceof Error ? error.message : String(error))
		process.exit(1)
	}
}

// 直接运行时执行
// 使用更可靠的方式检查是否直接运行脚本
function generateIndexNowKeyFile() {
	if (!blogConfig.indexNow.enable || !blogConfig.indexNow.key)
		return

	const currentFileUrl = new URL(import.meta.url)
	const currentFilePath = currentFileUrl.protocol === 'file:'
		? decodeURIComponent(currentFileUrl.pathname).replace(/^\/(.:\/)/, '$1')
		: currentFileUrl.pathname

	const __dirname = path.dirname(currentFilePath)
	const publicDir = path.resolve(__dirname, '../public')
	if (!fs.existsSync(publicDir))
		fs.mkdirSync(publicDir, { recursive: true })

	const outputPath = path.resolve(publicDir, `${blogConfig.indexNow.key}.txt`)
	fs.writeFileSync(outputPath, blogConfig.indexNow.key, 'utf-8')
	console.log(`成功生成IndexNow验证文件: ${outputPath}`)
}

if (process.argv[1]?.endsWith('generate-friend.ts')) {
	console.log('开始执行generateFcircleJson函数')
	generateFcircleJson()
	generateIndexNowKeyFile()
	console.log('generateFcircleJson函数执行完毕')
}
