// Simple store global basé sur localStorage pour persistance

class SelectionService {
  constructor() {
    const saved = localStorage.getItem("selectedMachines");
    this.selectedMachines = saved ? JSON.parse(saved) : [];
    this.listeners = [];
  }

  getSelected() {
    return this.selectedMachines;
  }

  isSelected(id) {
    return this.selectedMachines.includes(id);
  }

  toggle(id) {
    if (this.isSelected(id)) {
      this.selectedMachines = this.selectedMachines.filter((x) => x !== id);
    } else {
      this.selectedMachines = [...this.selectedMachines, id];
    }
    this._persist();
    this._notify();
  }

  clear() {
    this.selectedMachines = [];
    this._persist();
    this._notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  _persist() {
    localStorage.setItem("selectedMachines", JSON.stringify(this.selectedMachines));
  }

  _notify() {
    this.listeners.forEach((l) => l(this.selectedMachines));
  }
}

export const selectionService = new SelectionService();
