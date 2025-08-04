class Option {
  constructor(value, text, selected = false) {
    this.value = value;
    this.text = text;
    this.selected = selected;
  }
}

class Multiselect {
  selectedOptions = [];
  template = {
    parentContainer: null,
    selectContainer: null,
    placeholderContainer: null,
    inputContainer: null,
    selectOptionsContainer: null,
    maxSelectedContainer: null,
  };

  constructor(element, config = {}) {
    let defaults = {
      placeholder: "Select item(s)",
      max: null,
      search: true,
      selectAll: true,
      listAll: true,
      closeListOnItemSelect: false,
      name: "",
      width: "",
      height: "",
      dropdownWidth: "",
      dropdownHeight: "",
      data: [],
      onChange: function () {},
      onSelect: function () {},
      onUnselect: function () {},
    };
    this.config = Object.assign(defaults, config);
    this.selectElement =
      typeof element === "string" ? document.querySelector(element) : element;

    this.name = this.selectElement.getAttribute("name")
      ? this.selectElement.getAttribute("name")
      : "multi-select-" + Math.floor(Math.random() * 1000000);

    if (!this.config.data.length) {
      let options = this.selectElement.querySelectorAll("option");
      options.forEach((option) => {
        this.config.data.push({
          value: option.value,
          text: option.innerHTML,
          selected: option.selected,
          html: option.getAttribute("data-html"),
        });
      });
    }

    console.log("this ", this);
    this.initTemplate();
  }

  initTemplate() {
    console.log("Multiselect initialized in", this.parentContainer);
    this.template.parentContainer = this.loadTemplate();

    this.template.maxSelectedContainer = this.template.parentContainer.querySelector(
      ".multi-select-header-max"
    );
    if (this.template.maxSelectedContainer) {
      this.template.maxSelectedContainer.textContent = this.maxSelectedText;
    }

    this.template.placeholderContainer = this.template.parentContainer.querySelector(
      ".multi-select-header-placeholder"
    );
    if (this.template.placeholderContainer) {
      this.template.placeholderContainer.textContent = this.config.placeholder;
    }

    this.template.selectOptionsContainer = this.template.parentContainer.querySelector(
      ".multi-select-options"
    );
    if (this.template.selectOptionsContainer) {
        if(this.config.selectAll) {
            this.template.selectOptionsContainer.innerHTML = this.selectAllHtml;
        }
        this.template.selectOptionsContainer.innerHTML += this.optionsHtml;
    }

    console.log("Template loaded", this.template);
    this.selectElement.replaceWith(this.template.parentContainer);
  }

  loadTemplate() {
    return document
      .getElementById("multiselect-template")
      .content.cloneNode(true);
  }

  get optionsHtml() {
    let html = "";
    this.config.data.forEach((item) => {
      html += `
        <div class="multi-select-option}" data-value="${item.value}">
            <span class="multi-select-option-radio"></span>
                <span class="multi-select-option-text">
                    ${item.html ? item.html : item.text}
                </span>
        </div>`;
    });
    return html;
  }

  get selectAllHtml(){
    return `<div class="multi-select-all">
                <span class="multi-select-option-radio"></span>
                <span class="multi-select-option-text">Select all</span>
            </div>`;
  }

  get maxSelectedText() {
    if (!this.config.max) return "";
    return (this.selectedValues?.length || "0") + "/" + this.config.max;
  }
}
