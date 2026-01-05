
export const leftMenu: ILeftMenu[] = [
    {
        title: '地图下载',
        type: 'top',
        icon: 'menu',
        key: 'home',
        router: '/home',
        subPanel: true
    },{
        title: '下载管理',
        type: 'top',
        icon: 'download2',
        key: 'download',
        router: '/download',
        subPanel: true
    },{
        title: '设置',
        type: 'bottom',
        icon: 'setting',
        key: 'setting',
        router: '/setting',
        subPanel: true
    }, {
        title: '更多',
        type: 'bottom',
        icon: 'about',
        key: 'about',
        router: '/about',
        subPanel: true
    }
]