import assert from 'node:assert/strict'
import test from 'node:test'
import { isSeoIndexablePath, isSeoPublicPostQuery, resolveCanonicalUrl, resolveSeoImage } from './seo'

const siteUrl = 'https://www.qixz.cn/'
const fallbackImage = 'https://www.qixz.cn/avatar.avif'

test('resolveCanonicalUrl removes query and hash from site paths', () => {
	assert.equal(resolveCanonicalUrl('/?page=2#posts', siteUrl), 'https://www.qixz.cn/')
	assert.equal(resolveCanonicalUrl('/hello?sort=date', siteUrl), 'https://www.qixz.cn/hello')
})

test('resolveSeoImage returns absolute image url with fallback', () => {
	assert.equal(resolveSeoImage('/cover.jpg', siteUrl, fallbackImage), 'https://www.qixz.cn/cover.jpg')
	assert.equal(resolveSeoImage(undefined, siteUrl, fallbackImage), fallbackImage)
})

test('isSeoIndexablePath rejects previews and drafts', () => {
	assert.equal(isSeoIndexablePath('/posts/hello'), true)
	assert.equal(isSeoIndexablePath('/preview'), false)
	assert.equal(isSeoIndexablePath('/previews/hello'), false)
	assert.equal(isSeoIndexablePath('/posts/draft', true), false)
})

test('isSeoPublicPostQuery only treats published post queries as public lists', () => {
	assert.equal(isSeoPublicPostQuery('posts/%'), true)
	assert.equal(isSeoPublicPostQuery('previews/%'), false)
})
