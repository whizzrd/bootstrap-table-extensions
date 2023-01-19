/**
 * @author vincent loh <vincent.ml@gmail.com>
 * @update J Manuel Corona <jmcg92@gmail.com>
 * @update zhixin wen <wenzhixin2010@gmail.com>
 * @update joris van lier <whizzrd@gmail.com>
 */

const Utils = $.fn.bootstrapTable.utils

$.extend($.fn.bootstrapTable.defaults, {
  stickyToolbar: false,
  stickyToolbarLeadY: 0,
  stickyToolbarOffsetY: 0,
  stickyToolbarOffsetLeft: 0,
  stickyToolbarOffsetRight: 0
})

$.BootstrapTable = class extends $.BootstrapTable {
  initHeader (...args) {
    super.initHeader(...args)

    if (!this.options.stickyToolbar) {
      return
    }

    this.$tableBody.find('.sticky-toolbar-container,.sticky_toolbar_anchor_begin,.sticky_toolbar_anchor_end').remove()

    this.$el.before('<div class="sticky-toolbar-container"></div>')
    this.$el.before('<div class="sticky_toolbar_anchor_begin"></div>')
    this.$el.after('<div class="sticky_toolbar_anchor_end"></div>')
    this.$toolbar.addClass('sticky-toolbar')

    // clone toolbar just once, to be used as sticky toolbar
    // deep clone toolbar, using source toolbar affects tbody>td width
    this.$stickyToolbarContainer = this.$tableBody.find('.sticky-toolbar-container')
    this.$stickyToolbarBegin = this.$tableBody.find('.sticky_toolbar_anchor_begin')
    this.$stickyToolbarEnd = this.$tableBody.find('.sticky_toolbar_anchor_end')
    this.$stickyToolbar = this.$toolbar.clone(true, true)

    // render sticky on window scroll or resize
    const resizeEvent = Utils.getEventName('resize.sticky-toolbar-table', this.$el.attr('id'))
    const scrollEvent = Utils.getEventName('scroll.sticky-toolbar-table', this.$el.attr('id'))

    $(window).off(resizeEvent).on(resizeEvent, () => this.renderstickyToolbar())
    $(window).off(scrollEvent).on(scrollEvent, () => this.renderstickyToolbar())
    this.$tableBody.off('scroll').on('scroll', () => this.matchPositionX())
  }

  onColumnSearch ({ currentTarget, keyCode }) {
    super.onColumnSearch({ currentTarget, keyCode })
    this.renderstickyToolbar()
  }

  resetView (...args) {
    super.resetView(...args)

    $('.bootstrap-table.fullscreen').off('scroll')
      .on('scroll', () => this.renderstickyToolbar())
  }

  horizontalScroll () {
    super.horizontalScroll()
    this.$tableBody.on('scroll', () => this.matchPositionX())
  }

  renderstickyToolbar () {
    const that = this

    this.$stickyToolbar = this.$toolbar.clone(true, true)

    const top = $(window).scrollTop()
    // top anchor scroll position, minus toolabr height
    const start = this.$stickyToolbarBegin.offset().top - this.options.stickyToolbarOffsetY - this.$toolbar.height() - this.options.stickyToolbarLeadY
    // bottom anchor scroll position, minus toolabr height, minus sticky height
    const end = this.$stickyToolbarEnd.offset().top - this.options.stickyToolbarOffsetY - this.$toolbar.height()

    // show sticky when top anchor touches toolbar, and when bottom anchor not exceeded
    if (top > start && top <= end) {
      // match table style
      this.$stickyToolbarContainer.show().addClass(this.$container.attr('class'))
      // match bootstrap table style
      this.$stickyToolbarContainer.show().addClass('fix-sticky-toolbar fixed-table-container')
      // stick it in position
      const coords = this.$tableBody[0].getBoundingClientRect()
      let width = '100%'
      let stickyToolbarOffsetLeft = this.options.stickyToolbarOffsetLeft
      let stickyToolbarOffsetRight = this.options.stickyToolbarOffsetRight

      if (!stickyToolbarOffsetLeft) {
        stickyToolbarOffsetLeft = coords.left
      }
      if (!stickyToolbarOffsetRight) {
        width = `${coords.width}px`
      }
      if (this.$el.closest('.bootstrap-table').hasClass('fullscreen')) {
        stickyToolbarOffsetLeft = 0
        stickyToolbarOffsetRight = 0
        width = '100%'
      }
      this.$stickyToolbarContainer.css('top', `${this.options.stickyToolbarOffsetY}px`)
      this.$stickyToolbarContainer.css('left', `${stickyToolbarOffsetLeft}px`)
      this.$stickyToolbarContainer.css('right', `${stickyToolbarOffsetRight}px`)
      this.$stickyToolbarContainer.css('width', `${width}`)
      // create scrollable container for header
      this.$stickyTable = $('<table/>')
      this.$stickyTable.addClass(this.options.classes)
      // append cloned header to dom
      this.$stickyToolbarContainer.html(this.$stickyTable.append(this.$stickyToolbar))
      // match clone and source header positions when left-right scroll
      this.matchPositionX()
    } else {
      this.$stickyToolbarContainer.removeClass('fix-sticky-toolbar').hide()
    }
  }

  matchPositionX () {
    this.$stickyToolbarContainer.scrollLeft(this.$tableBody.scrollLeft())
  }
}
