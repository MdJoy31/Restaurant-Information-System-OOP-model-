const { MenuItem } = require("../models");

class MenuFactory {
  static async createMenuItem(data) {
    const menuItem = await MenuItem.create(data);
    return menuItem;
  }

  static async updateMenuItem(id, data) {
    const menuItem = await MenuItem.findByPk(id);
    if (!menuItem) {
      throw new Error("Menu item not found");
    }
    await menuItem.update(data);
    return menuItem;
  }

  static async deleteMenuItem(id) {
    const menuItem = await MenuItem.findByPk(id);
    if (!menuItem) {
      throw new Error("Menu item not found");
    }
    await menuItem.destroy();
    return menuItem;
  }

  static async getMenuItems() {
    const menuItems = await MenuItem.findAll();
    return menuItems;
  }

  static async getMenuItemById(id) {
    const menuItem = await MenuItem.findByPk(id);
    if (!menuItem) {
      throw new Error("Menu item not found");
    }
    return menuItem;
  }
}

module.exports = MenuFactory;
