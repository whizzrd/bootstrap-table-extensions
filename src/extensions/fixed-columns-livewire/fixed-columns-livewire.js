$.BootstrapTable = class extends $.BootstrapTable {
    initFixedColumnsBody () {
        super.initFixedColumnsBody()

        //disable livewire elements
        this.$fixedColumns.find('*[wire\\:id]')
            .removeAttr('wire:id')
        $.each(this.$fixedColumns.find('*'), (j, el) => {
            for (var i = 0, atts = el.attributes, n = atts.length; i < n; i++) {
                if(atts[i].nodeName.toLowerCase().indexOf('wire:') === 0) {
                    el.removeAttribute(atts[i].nodeName)
                    el.setAttribute('disabled', 'disabled')
                }
            }
        })
    }
}
