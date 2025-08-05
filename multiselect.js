class Option {
  constructor(value, text, selected = false) {
    this.value = value;
    this.text = text;
    this.selected = selected;
  }
}

class Multiselect {
  selectedItems = [];
  template = {
    parentContainer: null,
    selectContainer: null,
    headerPlaceholderContainer: null,
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
    this.addEventListeners();
  }

  initTemplate() {
    console.log("Multiselect initialized in", this.parentContainer);
    this.template.parentContainer = this.loadTemplate();
    this.template.parentContainer.id = this.name;

    this.template.maxSelectedContainer =
      this.template.parentContainer.querySelector(".multi-select-header-max");
    if (this.template.maxSelectedContainer) {
      this.template.maxSelectedContainer.textContent = this.maxSelectedText;
    }

    this.template.headerPlaceholderContainer =
      this.template.parentContainer.querySelector(
        ".multi-select-header-placeholder"
      );
    if (this.template.headerPlaceholderContainer) {
      this.template.headerPlaceholderContainer.textContent =
        this.config.placeholder;
    }

    this.template.selectOptionsContainer =
      this.template.parentContainer.querySelector(".multi-select-options");
    if (this.template.selectOptionsContainer) {
      if (this.config.selectAll) {
        this.template.selectOptionsContainer.innerHTML = this.selectAllHtml;
      }
      this.template.selectOptionsContainer.innerHTML += this.optionsHtml;
    }

    console.log("Template loaded", this.template.parentContainer);
    this.selectElement.replaceWith(this.template.parentContainer);
  }

  loadTemplate() {
    return document
      .getElementById("multiselect-template")
      .content.firstElementChild.cloneNode(true);
  }

  get optionsHtml() {
    let html = "";
    this.config.data.forEach((item) => {
      let option = document.createElement("div");
      option.className = "multi-select-option";
      option.setAttribute("data-value", item.value);
      option.innerHTML = `
            <span class="multi-select-option-radio"></span>
            <span class="multi-select-option-text">
                ${item.html ? item.html : item.text}
            </span>
        `;
      html += option.outerHTML;
    });

    return html;
  }

  get selectAllHtml() {
    return `<div class="multi-select-all" data-value="select-all">
                <span class="multi-select-option-radio"></span>
                <span class="multi-select-option-text">Select all</span>
            </div>`;
  }

  get maxSelectedText() {
    if (!this.config.max) return "";
    return (this.selectedItems?.length || "0") + "/" + this.config.max;
  }

  addEventListeners() {
    console.log("addEventlisteneres", this.template);
    this.template.selectOptionsContainer.childNodes.forEach((option) => {
      option.addEventListener("click", (event) => {
        this.optionClick(event, option);
      });
    });
    console.log("Event listeners added ", this.name);
    document.getElementById(this.name)?.addEventListener("click", (event) => {
      console.log("Parent container clicked", event);
      if (!event.target.classList.contains("multi-select-header")) return;
      let header = event.target;

      if (header.classList.contains("multi-select-header-active")) {
        header.classList.remove("multi-select-header-active");
      } else {
        header.classList.add("multi-select-header-active");
      }
    });
  }

  optionClick(event, option) {
    console.log("Option clicked", option.dataset.value, this.selectedItems);

    // select all functionality
    if (option.dataset.value === "select-all") {
      if (this.selectedItems.length === this.config.data.length) {
        this.selectedItems = [];
        this.template.selectOptionsContainer.childNodes.forEach((opt) => {
          opt.classList.remove("multi-select-selected");
          this.toggleDisabledOptions();
        });
      } else {
        this.selectedItems = this.config.data.map((item) => item.value);
        this.template.selectOptionsContainer.childNodes.forEach((opt) => {
          opt.classList.add("multi-select-selected");
          this.toggleDisabledOptions();
        });
      }
      return;
    }

    if (this.selectedItems.includes(option.dataset.value)) {
      console.warn("Unselecting item", option.dataset.value, this.selectedItems);
      this.selectedItems = this.selectedItems.filter((item) => item !== option.dataset.value);
      console.warn("Unselecting item", option.dataset.value, this.selectedItems);
      option.classList.remove("multi-select-selected");
      this.template.maxSelectedContainer.textContent = this.maxSelectedText;
      this.toggleDisabledOptions();
      this.updateSelectedItems();
      return;
    }

    if (this.config.max && this.selectedItems.length >= this.config.max) {
      console.warn("Max selection limit reached");
      this.toggleDisabledOptions();
      return;
    }

    this.selectedItems.push(option.dataset.value);
    this.template.maxSelectedContainer.textContent = this.maxSelectedText;
    if (!option.classList.contains("multi-select-selected")) {
      option.classList.add("multi-select-selected");
    }
    this.updateSelectedItems();

    this.toggleDisabledOptions();
  }

  updateSelectedItems() {
    console.error("Updating selected items", this.selectedItems);
    let html = this.selectedItems
      .map(
        (value) => `<span  class="multi-select-header-option">${value}</span>`
      )
      .join("");
    console.log("Selected items HTML", html);

    console.log("Max selected text", this.template.headerPlaceholderContainer);

    this.template.maxSelectedContainer.textContent = this.maxSelectedText;
    this.template.headerPlaceholderContainer.innerHTML = html;
  }

  disableNonSelectedOptions() {
    console.log("Disabling non-selected options");
    this.template.selectOptionsContainer.childNodes.forEach((option) => {
      if (!this.selectedItems.includes(option.dataset.value)) {
        option.classList.add("multi-select-disabled");
      } else {
        option.classList.remove("multi-select-disabled");
      }
    });
  }

  enableAllOptions() {
    console.log("Enabling all options");
    this.template.selectOptionsContainer.childNodes.forEach((option) => {
      option.classList.remove("multi-select-disabled");
    });
  }

  toggleDisabledOptions() {
    if (this.config.max && this.config.max <= this.selectedItems.length) {
      this.disableNonSelectedOptions();
    } else {
      this.enableAllOptions();
    }
  }
}
