const Utils = $.fn.bootstrapTable.utils

$.extend($.fn.bootstrapTable.defaults, {
  containerStyle: false,
  containerStyleClass: 'card',
  containerStyleToolbarClass: 'card-header',
  containerStyleToolbarBarsClass: '',
  containerStyleTableContainerClass: 'card-body',
  containerStyleTableBodyClass: 'table-responsive',
  containerStylePaginationClass: 'card-footer'
})

$.BootstrapTable = class extends $.BootstrapTable {

  containerStyleSupported () {
    return this.options.containerStyle
  }

  initContainer () {
    super.initContainer()

    if (!this.containerStyleSupported()) {
      return
    }

    this.$container.addClass(this.options.containerStyleClass)
    // this.$tableContainer
    this.$toolbar.addClass(this.options.containerStyleToolbarClass)
    this.$tableContainer.addClass(this.options.containerStyleTableContainerClass)
    this.$tableBody.addClass(this.options.containerStyleTableBodyClass)
    this.$pagination.addClass(this.options.containerStylePaginationClass)
  }

  initToolbar () {
    super.initToolbar()
    this.$toolbar.find('.bs-bars').addClass(this.options.containerStyleToolbarBarsClass)
  }
}
