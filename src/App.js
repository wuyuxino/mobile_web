import React from 'react'
import { Menu } from 'antd'
import { Get } from 'webh5frame'
const { SubMenu } = Menu

const server_url = 'http://loveit.cool:10002/v1/graphql'

class App extends React.Component {
	rootSubmenuKeys = ['sub1', 'sub2', 'sub4']
	constructor(props) {
		super(props)
		this.state = {
			openKeys: ['sub1'],
			main_nav: [],
			nav_title: '',
			currentMapNav: [],
			currentArticle: '',
			isopen_nav: [],
			current_nav: 0,
			current_nav_list: [0, 0]
		}
	}

	/* 查询所有tab */
	getMainNav = () => {
		let $this = this
		Get(
			server_url,
			null,
			{
				table_name: 'main_nav',
				search_field: `{
						id,
						name
					}`
			},
			(e) => {
				if (e.data.main_nav) {
					$this.getSecondaryNavList(e.data.main_nav[0].id)
					$this.setState({ main_nav: e.data.main_nav, nav_title: e.data.main_nav[0].name })
					console.log('123456', e)
				} else {
					$this.setState({ main_nav: [] })
				}
			}
		)
	}

	/* 查询当前tab下的分组以及分组文章名称 */
	getSecondaryNavList = (main_nav_id) => {
		let $this = this
		/* 初始化数据 */
		this.setState({
			currentMapNav: [],
			currentArticle: '### 该分类下暂无文章内容！',
			current_nav: 0,
			current_nav_list: [0, 0],
			isopen_nav: []
		})
		/* 设置大的导航map结构 */
		let MainNav = []
		let openNav = []
		/* 查询当前第一个的所有文件 */
		Get(
			server_url,
			null,
			{
				table_name: 'secondary_nav',
				search_field: `(where: { main_nav_id: {_eq: ${JSON.stringify(main_nav_id)} }}
					){
						id,
						name
					}`
			},
			(e) => {
				console.log('1234567', e)
				let isSet = []
				for (let j = 0; j < e.data.secondary_nav.length; j++) {
					isSet.push(false)
				}
				for (let i = 0; i < e.data.secondary_nav.length; i++) {
					let obj = {
						nav: e.data.secondary_nav[i].name,
						list: [],
						isopen: true
					}
					let obj_open = {
						isopen: true,
						list: []
					}
					Get(
						server_url,
						null,
						{
							table_name: 'article',
							search_field: `(where: { secondary_nav_id: {_eq: ${JSON.stringify(e.data.secondary_nav[i].id)} }}
								){
									id,
									name
								}`
						},
						(es) => {
							obj.list = es.data.article
							MainNav.push(obj)
							for (let is = 0; is < es.data.article.length; is++) {
								obj_open.list.push(false)
							}
							openNav.push(obj_open)
							isSet[i] = true
						}
					)
				}
				$this.timer = setInterval(() => {
					if (isSet.includes(false) !== true) {
						if (openNav.length !== 0) { openNav[0].list[0] = true }
						$this.setState({ isopen_nav: openNav, currentMapNav: MainNav })
						if (openNav.length !== 0) {
							$this.getArticleContent(MainNav[0].list[0] ? MainNav[0].list[0].id : null)
						}
						clearInterval($this.timer)
					}
				}, 200)
			}
		)
	}

	/* 点击查询指定文章内容 */
	getArticleContent = (id) => {
		if (id == null) { return }
		let $this = this
		Get(
			server_url,
			null,
			{
				table_name: 'article',
				search_field: `(where: { id: {_eq: ${JSON.stringify(id)} }}
					){
						id,
						name,
						content
					}`
			},
			(e) => {
				console.log('123', e)
				// $this.setState({ currentArticle: e.data.article[0].content })
				/* 检查文章中a标签 */
				// this.addTarget()
			}
		)
	}

	onOpenChange = openKeys => {
		const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
		if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
			this.setState({ openKeys });
		} else {
			this.setState({
				openKeys: latestOpenKey ? [latestOpenKey] : [],
			});
		}
	}

	componentDidMount() {
		/* 获取默认菜单 */
		this.getMainNav()
		/* 页面尺寸变化 */
		window.addEventListener('resize', () => {
			this.setState({ refresh: true })
		})
	}

	render() {
		const { main_nav } = this.state
		return (
			<div
				style={{
					position: 'relative',
					background: '#000',
					width: '100%',
					height: window.innerHeight,
				}}>
				<div
					style={{
						width: '100%',
						height: 50,
						fontSize: '20px',
						fontWeight: '800',
						textAlign: 'center',
						lineHeight: '50px',
						color: '#fff',
						letterSpacing: 2
					}}>
					文章列表
				</div>
				<Menu
					mode="inline"
					theme="dark"
					openKeys={this.state.openKeys}
					onOpenChange={this.onOpenChange}
					style={{ width: '100%' }}>
					{
						console.log('123333', main_nav)
					}
					{
						main_nav && main_nav.map((i, n) => {
							return (
								<SubMenu key={i.id} title={i.name}>
									<Menu.Item key="5">Option 5</Menu.Item>
									<Menu.Item key="6">Option 6</Menu.Item>
									<SubMenu key={i.id} title="Submenu">
										<Menu.Item key="7">Option 7</Menu.Item>
										<Menu.Item key="8">Option 8</Menu.Item>
									</SubMenu>
								</SubMenu>
							)
						})
					}
				</Menu>
			</div>
		)
	}
}

export default App;
