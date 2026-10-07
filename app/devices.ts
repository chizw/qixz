export interface item {
	name: string
	category: '生产力' | '出行'
	category_color?: '#3af;' | '#3ba;'
	desc: string
	info?: Record<string, string>
	厂商?: Record<string, string>
	tag?: string[]
	image?: string
	date?: string
	src?: string
	money?: number
}
export interface manufacturers {
	cpu_info: 'AMD' | 'INTEL'
	memory_info: 'LPDDR5' | 'LPDDR4' | 'LPDDR3'
	graphics_card_info: 'AMD' | 'NVIDA'
	ssd_info: 'SSD' | 'NVME SSD'
}
export const equipment: item[] = [
	{
		name: '暗影精灵7',
		image: 'https://s3.qixz.cn/ywty/2026/04/19/69e425ee5f814.png',
		src: 'https://www.hp.com/cn-zh/gaming-pc/laptops.html',
		category: '生产力',
		desc: '16.1 英寸高端游戏本，采用第 11 代英特尔酷睿处理器平台，属于 OMEN 系列的经典游戏本产品线。',
		info: {
			芯片: 'Intel Core i5-11400H',
			内存: '16G LPDDR4 3200MHz',
			显卡: 'NVIDIA GeForce RTX 3050',
			存储: '512G PCIE4 SSD',
			机器颜色: '黑色',
		},
		tag: ['游戏本', 'NVIDIA'],
		date: '2022-06-01',
		money: 5799,
	},
	{
		name: 'REDMI K100 Pro',
		image: 'https://s3.qixz.cn/ywty/2026/08/12/pms_1786351896.08612122.png',
		src: 'https://www.mi.com/prod/redmi-k100-pro',
		category: '生产力',
		desc: '旗舰双芯 185Hz 满血开场 满分答案',
		info: {
			芯片: '第五代骁龙®8至尊版 V Series',
			内存: '16GB + 256GB',
			续航: '8580mAh+100W',
			黑科技: 'AI游戏独显D2',
			影像: '32MP+200MP+50MP+8MP',
			颜色: '白色',
		},
		tag: ['水桶机', '红米'],
		date: '2026-08-12',
		money: 3599,
	},
	{
		name: '狼蛛S31',
		image: 'https://s3.qixz.cn/ywty/2026/04/19/69e425e2d02db.png',
		src: 'https://detail.zol.com.cn/1973/1972786/param.shtml',
		category: '生产力',
		desc: '一款高性价比有线电竞鼠标，兼顾游戏与办公需求，支持四挡DPI调节与RGB炫彩呼吸灯效，人体工学设计带来舒适握持体验。',
		info: {
			传感器: '光学传感器',
			DPI: '800/1600/2400/3200',
			连接方式: '有线USB 2.0',
			机器版本: '入门电竞版',
			机器颜色: '黑色',
		},
		tag: ['电竞鼠标', '狼蛛'],
		date: '2025-08-17',
		money: 29,
	},
	{
		name: '微星GK50Z',
		image: 'https://s3.qixz.cn/ywty/2026/04/19/69e425e257dba.png',
		src: 'https://www.msi.cn/Gaming-Gear/VIGOR-GK50Z/Specification',
		category: '生产力',
		desc: '一款百元级高性价比有线机械键盘，104键全尺寸布局，搭载高特防尘机械轴体，配备多彩混光与1.8米PVC线缆，兼顾游戏与办公需求，5000万次按压寿命保障耐用性{insert\_element\_0\_}。',
		info: {
			轴体: '青轴',
			按键数: '104键',
			背光: '多彩混光',
			连接方式: '有线USB 2.0',
			机器版本: '入门电竞版',
			机器颜色: '白色',
		},
		tag: ['青轴', '微星'],
		date: '2024-06-15',
		money: 98,
	},
	{
		name: 'REDMI Buds 8 Pro',
		image: 'https://s3.qixz.cn/ywty/2026/06/22/6a391c2726bce.jpg',
		src: 'https://www.mi.com/prod/redmi-buds-8-pro',
		category: '出行',
		desc: '小米深空降噪 3.0喧嚣即刻止步于耳畔，圈瓷同轴三单元，三擎声学“声”临其境',
		info: {
			单耳净重: '5.3g',
			发声单元: '双 DAC 三单元声学系统',
			蓝牙版本: '蓝牙5.4',
			降噪能力: '55dB｜5kHz 超宽频深度降噪',
			续航: '开/关 降噪单次续航4.5/8.5h，总续航16/35h',
			防护等级: 'IP54',
			黑科技: '动态头部追踪+云隙光灯效 2.0+环境感知自适应降噪',
			耳机颜色: '薄雾蓝',
		},
		tag: ['红米', '智能无级降噪'],
		date: '2026-02-08',
		money: 439,
	},
	{
		name: '小米手环 10',
		image: 'https://s3.qixz.cn/ywty/2026/06/22/6a391a7ee7a10.png',
		src: 'https://www.mi.com/prod/xiaomi-smart-band-10',
		category: '出行',
		desc: '时尚出众，轻薄无感，搭配澎湃OS 3.0，提供全面的运动数据与健康分析，支持睡眠监测。',
		info: {
			主体净重: '15.95g',
			屏幕参数: '1.72英寸 1500尼特',
			防水等级: '5ATM',
			无线连接: '蓝牙5.4',
			电池容量: '233mAh',
			手环颜色: '黑色',
		},
		tag: ['小米手环', '智能手环'],
		date: '2026-06-013',
		money: 239,
	},
	{
		name: '酷态科25号SE',
		image: 'https://s3.qixz.cn/ywty/2026/06/25/6a3d2b630be5e.webp',
		src: 'https://cuktech.com.cn/',
		category: '出行',
		desc: '25000mAh大容量（88.2Wh），2C1A三口输出（单口最高120W），支持小米120W澎湃秒充、PD/PPS/QC/SCP等多协议快充，自带USB-C编织线，支持100W自充，约540g',
		info: {
			充电接口: 'Type-C',
			输出接口: '三口（2C 1A）',
			电池容量: '25000 mAh',
			充电协议: 'PD/QC/PPS/SCP/MiPPS/FCP/AFC',
			重量: '532g',
		},
		tag: ['酷态科', '超级电能块'],
		date: '2026-06-25',
		money: 144.9,
	},
	{
		name: 'JAVA 御夫座',
		image: 'https://s3.qixz.cn/ywty/2026/04/19/69e42689610b3.png', // 产品实拍图（含车架、轮组、细节）
		src: 'https://www.javabike.cn/ProductsDetail/3906.html', // 品牌官网链接
		category: '出行', // 所属分类（出行装备）
		desc: '入门级轻量化公路车，采用航空级铝合金车架与Shimano变速系统，兼顾通勤效率与运动骑行体验，适合城市铺装路面及轻度长途拉练，人体工学坐垫+弯把设计降低骑行疲劳。',
		info: { // 核心参数（按优先级排序）
			车架材质: '6061铝合金破风一体车架（内走线）',
			变速系统: '蓝图R5 18速变速套件',
			轮组规格: '700C铝合金双层刀圈轮组',
			刹车类型: '油压碟刹',
			整车重量: '约9.8kg（17寸车架）',
			车车颜色: '白紫色',
		},
		tag: ['公路车', 'JAVA'],
		date: '2023-07-03',
		money: 2399,
	},
	{
		name: '猫与少年双肩包',
		image: 'https://s3.qixz.cn/ywty/2026/06/22/6a391a7e7aaf8.webp',
		src: 'https://www.kokuyo.cn/',
		category: '出行',
		desc: '高颜值双肩包，主打萌系猫主题设计，融合经典简约美学与少年感元素。',
		info: {
			材质: '防泼水聚酯纤维（外层）+ 透气网布（内层）',
			容量: '20L',
			尺寸: '45cm×30cm×18cm（高×宽×厚）',
			收纳分层: '主仓（含笔记本电脑隔层）+ 前袋（含笔插/卡片位）+ 双侧弹性侧袋',
			背负系统: 'S型人体工学肩带 + 透气背板',
			颜色: '奶白灰',
		},
		tag: ['国誉', '猫与少年'],
		date: '2025-11-04',
		money: 169,
	},
]
