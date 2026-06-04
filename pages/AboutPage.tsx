import './pages.css'

export function AboutPage() {
  return (
    <article className="page-about card">
      <h2 className="detail-h3">愿景</h2>
      <p className="body-text">
        「筑韵」以文化传承为核心、科技赋能为亮点，用轻量交互呈现中国古代建筑的工艺与科学智慧，助力科普与教学。
      </p>
      <h2 className="detail-h3">联系与反馈</h2>
      <p className="body-text muted">
        账号登录、收不到验证或重置邮件等问题，请通过筑韵官方渠道或你所在机构提供的联系方式获得协助。
      </p>
      <h2 className="detail-h3">开发说明</h2>
      <p className="body-text muted">
        本示例为前端静态演示：数据内嵌于页面，收藏与记录保存在浏览器本地存储，无需注册登录。
      </p>
      <h2 className="detail-h3">素材来源</h2>
      <p className="body-text muted">
        建筑图片使用开放图库示例图，仅供学习演示；正式上架请替换为自有版权或授权素材并注明出处。
      </p>
    </article>
  )
}
