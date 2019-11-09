/* eslint-disable no-unused-vars */
exports.Trigger = class Trigger {
  async get (id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }
}
