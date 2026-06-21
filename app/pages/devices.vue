<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useLayoutStore } from '~/stores/layout'
import { equipment } from '../devices'

const layoutStore = useLayoutStore()
layoutStore.setAside(['blog-stats', 'blog-tech', 'blog-log'])

useSeoMeta({
	title: '我的装备：展示生产力、娱乐和移动设备清单',
})

// 新增状态管理
const activeCategory = ref('生产力')

// 计算属性过滤设备
const filteredEquipment = computed(() =>
	equipment.filter(item => item.category === activeCategory.value),
)

function handleTabClick(category: string) {
	activeCategory.value = category
}

function goComment(content: string) {
	const input = document.querySelector('#twikoo .tk-input textarea')
	if (!(input instanceof HTMLTextAreaElement))
		return

	if (content?.trim()) {
		const quotes = content.split('\n').map(str => `> ${str}`)
		input.value = `${quotes}\n\n`
	}
	else {
		input.value = ''
	}
	input.dispatchEvent(new InputEvent('input'))

	const length = input.value.length
	input.setSelectionRange(length, length)
	input.focus()
}

const getCategoryCount = computed(() => (category: string) => {
	return equipment.filter(item => item.category === category).length
})
</script>

<template>
<div id="icat-equipment">
	<div class="equipment-category">
		<!-- 顶部导航栏 -->
		<div class="categories-tabs">
			<div class="tabs-container">
				<div
					v-for="category in ['生产力', '出行']"
					:key="category"
					class="category-tab"
					:class="{ active: activeCategory === category }"
					:style="{ '--tab-color': category === '生产力' ? '#3af' : category === '出行' ? '#3ba' : '' }"
					@click="handleTabClick(category)"
				>
					<icon :name="category === '生产力' ? 'ph-laptop-bold' : (category === '出行' ? 'ph-package-bold' : '')" />
					<span>{{ category }}</span>
					<span>{{ getCategoryCount(category) }}</span>
				</div>
			</div>
		</div>
		<!-- 设备展示区 -->
		<div class="equipment-list">
			<div v-for="(item, index) in filteredEquipment" :key="item.name + index" class="equipment-card">
				<div class="equipment-image">
					<img
						:src="item.image"
						:alt="item.name"
						loading="lazy"
					>
				</div>
				<div class="equipment-content">
					<div class="equipment-header">
						<h3 class="card-name">
							{{ item.name }}
						</h3>
						<div
							v-if="item.category === '生产力'" class="card-category"
							style="--category-color: #3AF;"
						>
							{{ item.category }}
						</div>
						<div
							v-if="item.category === '出行'" class="card-category" style="--category-color: #3BA;"
						>
							{{ item.category }}
						</div>
					</div>
					<div class="equipment-opinion">
						{{ item.desc }}
					</div>
					<div class="card-specs">
						<div v-for="([key, value]) in Object.entries(item.info ?? {})" :key="key" class="spec-item">
							<div class="spec-label">
								{{ key }}
							</div>
							<div class="spec-value">
								{{ value }}
							</div>
						</div>
					</div>
					<div class="card-tags">
						<span
							v-for="(tag, tagIndex) in item.tag ?? []" :key="tagIndex" class="tag" style="

----category-color: #3AF;"
						>
							{{ tag }}
						</span>
					</div>
					<div class="card-footer">
						<div class="purchase-info">
							<icon name="ph:calendar-bold" style="font-size: 16px;" />
							{{ item.date }}
						</div>
						<div class="price-info">
							￥{{ item.money }}
						</div>
					</div>
					<div class="equipment-actions">
						<a class="equipment-link" :href="item.src" :title="`跳转到${item.name}的产品详情`" target="_blank" el="noopener noreferrer">
							详情
						</a>
						<button class="comment-btn" type="button" aria-label="快速评论" @click="goComment(item.desc)">
							<Icon name="ph:chat-circle-bold" />
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<PostComment key="/equipment" path="/equipment" />
</template>

<style lang="scss" scoped>
// 装备页面样式优化 (苏晓河编写，2025年2月5日)
// 优化重点：提升加载性能，使用SCSS嵌套结构，语义化类名

#icat-equipment {
	--category-color-one: #3AF;
	--category-color-two: #3BA;

	padding-bottom: 12px;

	.equipment-category {
		margin: 1rem;
		padding-top: 1rem;

		.categories-tabs {
			display: flex;
			justify-content: center;
			overflow-x: auto;
			margin-bottom: 2rem;
			-webkit-overflow-scrolling: touch;

			.tabs-container {
				display: flex;
				flex-wrap: wrap;
				justify-content: center;
				gap: 0.5rem;
				padding: 0.5rem;

				.category-tab {
					display: flex;
					align-items: center;
					gap: 0.5rem;
					padding: 0.6rem 1.2rem;
					border: 2px solid var(--c-border);
					border-radius: 0.6rem;
					background: transparent;
					font-size: 0.95rem;
					white-space: nowrap;
					color: var(--c-text-2);
					transition: all 0.3s ease;
					cursor: pointer;
				}

				.active {
					background: color-mix(in srgb, var(--tab-color) 10%, transparent);
					font-weight: 600;
				}

				.active, :hover {
					border-color: var(--tab-color);
					color: var(--tab-color);
				}
			}
		}

		.category-title {
			margin: 20px 7px 0;
			font-size: 1.5rem;
			font-weight: 600;
			color: var(--icat-fontcolor);
		}

		.category-desc {
			margin: 0.5rem 7px 1rem;
			font-size: 0.9rem;
			line-height: 1.4;
			color: var(--icat-secondtext);
		}

		.equipment-list {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 16px;
			padding: 10px 0 0;

			.equipment-card {
				overflow: hidden;
				border: 1px solid var(--c-border);
				border-radius: 12px;
				background: var(--c-bg-2);
				transition: transform 0.3s ease, box-shadow 0.3s ease;

				&:hover {
					box-shadow: 0 4px 12px rgb(0 0 0 / 10%);
					transform: translateY(-2px);
				}

				.equipment-image {
					display: flex;
					align-items: center;
					justify-content: center;
					position: relative;
					overflow: hidden;
					width: 100%;
					height: 240px;
					background: rgb(255 255 255);

					img {
						width: 100%;
						height: 100%;
						padding: 0.8rem;
						transition: transform 0.3s;
						object-fit: contain;
					}
				}

				.equipment-content {
					display: flex;
					flex: 1;
					flex-direction: column;
					gap: 0.8rem;
					min-width: 0;
					padding: 16px;
					padding: 1rem;

					.equipment-header {
						display: flex;
						align-items: flex-start;
						justify-content: space-between;
						gap: 0.8rem;

						.card-name {
							overflow: hidden;
							margin-bottom: 8px;
							font-size: 1.125rem;
							font-weight: 700;
							line-height: 1.2;
							white-space: nowrap;
							text-overflow: ellipsis;
							color: var(--c-text);
						}

						.card-category {
							flex-shrink: 0;
							padding: 0.3rem 0.8rem;
							border-radius: 0.4rem;
							background: color-mix(in srgb, var(--category-color) 10%, transparent);
							font-size: 0.75rem;
							font-weight: 600;
							white-space: nowrap;
							color: var(--category-color);
						}
					}

					.card-specs {
						display: grid;
						grid-template-columns: repeat(2, 1fr);
						gap: 0.4rem;
						padding: 0;
						border-radius: 0;
						background: transparent;
						font-size: 0.8rem;

						.spec-item {
							display: flex;
							flex-direction: column;
							gap: 0.1rem;

							.spec-label {
								font-size: 0.7rem;
								font-weight: 500;
								color: var(--c-text-2);
							}

							.spec-value {
								font-size: 0.8rem;
								word-break: break-word;
								color: var(--c-text);
							}
						}
					}

					.equipment-opinion {
						display: -webkit-box;
						overflow: hidden;
						margin: 0;
						font-size: 0.9rem;
						-webkit-line-clamp: 2;
						line-clamp: 2;
						line-height: 1.4;
						word-break: break-word;
						color: var(--c-text-2);
						-webkit-box-orient: vertical;
					}

					.card-tags {
						display: flex;
						flex-wrap: wrap;
						gap: 0.3rem;

						.tag {
							display: inline-block;
							padding: 0.15rem 0.5rem;
							border-radius: 0.3rem;
							background: color-mix(in srgb, var(--c-primary) 10%, transparent);
							font-size: 0.7rem;
							white-space: nowrap;
							color: var(--c-primary);
						}
					}

					.card-footer, .card-footer div {
						display: flex;
						align-items: center;
					}

					.card-footer {
						flex-wrap: wrap;
						gap: 0.8rem;
						padding-top: 0.6rem;
						border-top: 1px solid var(--c-border);
						font-size: 0.75rem;
						color: var(--c-text-2);

						div {
							gap: 0.3rem;
						}
					}

					.equipment-actions {
						display: flex;
						align-items: center;
						justify-content: space-between;

						.equipment-link {
							padding: 6px 12px;
							border-radius: 6px;
							background: var(--c-border);
							font-size: 0.75rem;
							letter-spacing: 0.5px;
							text-decoration: none;
							color: var(--c-text);
							transition: all 0.3s ease;

							&:hover {
								box-shadow: 0 8px 16px -4px rgb(0 0 0 / 10%);
								background: var(--c-primary);
								color: var(--c-white);
							}
						}

						.comment-btn {
							display: flex;
							align-items: center;
							justify-content: center;
							padding: 6px 10px;
							border: none;
							border-radius: 6px;
							background: var(--c-border);
							color: var(--c-text);
							transition: all 0.3s ease;
							cursor: pointer;

							&:hover {
								box-shadow: 0 8px 16px -4px rgb(0 0 0 / 10%);
								background: var(--c-primary);
								color: var(--c-white);
							}

							.icon {
								font-size: 1rem;
							}
						}
					}
				}
			}
		}
	}
}

// 动画定义
@keyframes fadeIn {
	from { opacity: 0; }
	to { opacity: 1; }
}

// 响应式设计
@media screen and (max-width: 1024px) {
	#icat-equipment .equipment-category .equipment-list {
		grid-template-columns: repeat(2, 1fr);
		gap: 12px;
	}
}

@media screen and (max-width: 768px) {
	#icat-equipment .equipment-category {
		margin: 0.5rem;

		.equipment-list {
			grid-template-columns: 1fr;
			gap: 10px;

			.equipment-card .equipment-image img {
				height: 180px;
			}
		}
	}
}

@media screen and (max-width: 480px) {
	#icat-equipment .equipment-category {
		margin: 0.25rem;

		.category-title {
			margin: 10px 7px 0;
			font-size: 1.25rem;
		}

		.equipment-list .equipment-card .equipment-image img {
			height: 160px;
		}
	}
}
</style>
