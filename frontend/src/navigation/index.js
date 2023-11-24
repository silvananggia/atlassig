const navigation = () => {
    return [
      {
        title: 'Home',
        path: '/home',
        icon: 'tabler:smart-home',
      },
      {
        path: '/statistic',
        action: 'read',
        subject: 'acl-page',
        title: 'Access Control',
        icon: 'tabler:shield',
      }
    ]
  }
  
  export default navigation
  