import { Event } from "../../base-types";
import { SimpleUIComponent } from "../SimpleUIComponent";
import { UIManager } from "../UIManager";
export class Dropdown extends SimpleUIComponent {
    set value(value) {
        var _a;
        const option = (_a = this.options.find((v) => v === value)) !== null && _a !== void 0 ? _a : this.options[0];
        this.innerElements.button.textContent = option !== null && option !== void 0 ? option : null;
        this.onChange.trigger(this.value);
    }
    get value() {
        return this.innerElements.button.textContent;
    }
    set allowSearch(value) {
        this._allowSearch = value;
        if (value) {
            this.innerElements.search.classList.remove("hidden");
        }
        else {
            this.innerElements.search.classList.add("hidden");
        }
    }
    get allowSearch() {
        return this._allowSearch;
    }
    set label(value) {
        this.innerElements.label.textContent = value;
        if (value) {
            this.innerElements.label.classList.remove("hidden");
        }
        else {
            this.innerElements.label.classList.add("hidden");
        }
    }
    get label() {
        return this.innerElements.label.textContent;
    }
    constructor(components, name = "Tooeen Dropdown") {
        const template = `
    <div class="w-full">
      <label id="label" class="${UIManager.Class.Label}"></label>
      <button
      id="button"
      data-dropdown-toggle="dropdown"
      class="text-white bg-transparent w-full ring-1 ring-gray-500 focus:outline-none focus:ring-ifcjs-200 rounded-md text-base p-3 text-center inline-flex items-center"
      type="button">
        <svg class="w-2.5 h-2.5 ml-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
        </svg>
        </button>
      <div id="dropdown" class="z-10 absolute hidden px-4 py-3 mt-1 max-h-[300px] w-fit overflow-auto bg-[#212121] rounded-md shadow">
        <div id="search" class="hidden">
          <label class="block leading-6 text-gray-400 text-xs">Search</label>
          <input id="searchInput" class="block bg-transparent w-full rounded-md p-3 text-white ring-1 text-base ring-gray-500 placeholder:text-gray-400 focus:ring-ifcjs-200 focus:outline-none"></input>
        </div>
        <ul id="dropdownList" class="text-sm text-white list-none m-0 p-0"></ul>
      </div>
    </div>
    `;
        super(components, template);
        this.name = "TooeenDropdown";
        this.options = [];
        this.onChange = new Event();
        this._allowSearch = false;
        this.hide = (event) => {
            if (!this.get().contains(event.target)) {
                this.innerElements.dropdown.classList.add("hidden");
            }
        };
        this.innerElements = {
            label: this.getInnerElement("label"),
            button: this.getInnerElement("button"),
            dropdown: this.getInnerElement("dropdown"),
            search: this.getInnerElement("search"),
            searchInput: this.getInnerElement("searchInput"),
            dropdownList: this.getInnerElement("dropdownList"),
        };
        this.setSearch();
        this.innerElements.button.onclick = () => this.toggle();
        this.setupEvents(true);
        this.label = name;
    }
    async dispose(onlyChildren = false) {
        super.dispose(onlyChildren);
        this.onChange.reset();
        this.setupEvents(false);
    }
    toggle() {
        if (this.innerElements.dropdown.classList.contains("hidden")) {
            this.innerElements.dropdown.classList.remove("hidden");
        }
        else {
            this.innerElements.dropdown.classList.add("hidden");
        }
    }
    addOption(...value) {
        const options = value.filter((option) => !this.options.includes(option));
        for (const option of options) {
            this.options.push(option);
            const li = document.createElement("li");
            li.id = `${option.replace(/\s+/g, "_")}-${this.id}`;
            li.className =
                "py-2 text-base cursor-pointer hover:text-ifcjs-200 m-0 p-0";
            li.textContent = option;
            li.onclick = () => {
                this.value = option;
                this.innerElements.dropdown.classList.add("hidden");
            };
            this.innerElements.dropdownList.appendChild(li);
        }
        return this;
    }
    removeOption(...value) {
        const optionsToDelete = value.filter((option) => this.options.includes(option));
        for (const name of optionsToDelete) {
            const option = this.get().querySelector(`#${name.replace(/\s+/g, "_")}-${this.id}`);
            if (!option)
                continue;
            option.remove();
        }
        this.options = this.options.filter((option) => !value.includes(option));
        return this;
    }
    setSearch() {
        this.innerElements.searchInput.oninput = () => {
            var _a;
            const searchValue = this.innerElements.searchInput.value.toLowerCase();
            const list = this.innerElements.dropdownList.children;
            for (const child of list) {
                const childText = (_a = child.textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase();
                if (!childText)
                    continue;
                if (childText.includes(searchValue)) {
                    child.classList.remove("hidden");
                }
                else {
                    child.classList.add("hidden");
                }
            }
        };
    }
    setupEvents(active) {
        if (active) {
            document.addEventListener("click", this.hide, true);
        }
        else {
            document.removeEventListener("click", this.hide, true);
        }
    }
}
//# sourceMappingURL=index.js.map