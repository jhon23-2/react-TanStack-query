const Task = require("../models/Task")



exports.getAllTask = async (req, res) => {
  try {

    // Server-side pagination: accept ?page=1&limit=5
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 12
    const offset = (page - 1) * limit

    const { rows: tasks, count } = await Task.findAndCountAll({
      limit,
      offset,
      order: [["id", "ASC"]],
    })

    const total = count
    const totalPages = Math.ceil(total / limit)

    res.json({
      success: true,
      message: "Tasks fetched successfully ✅",
      tasks,
      page,
      total,
      totalPages,
    })

  } catch (error) {
    res
      .status(500)
      .json({
        error: true,
        message: "Something was wrong ⛔️" + error
      })
  }
}

exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params
    const task = await Task.findByPk(id)

    if (!task) {
      return res.json({
        error: true,
        message: `Taks with id ${id} not exist`
      })
    }

    res.json({
      success: true,
      message: "Task feched successfully ✅",
      task
    })
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Something was wrong ⛔️" + error
    })
  }
}

// Create, Update, Delete with delay and random failure for testing optimistic updates

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body

    // // ⏱️ DELAY 2 SECONDS to see optimistic update
    // await new Promise(resolve => setTimeout(resolve, 2000))

    // // 🎲 Then fail randomly
    // if (Math.random() > 0.5) {
    //   return res.status(500).json({
    //     error: true,
    //     message: "❌ Simulated error after delay"
    //   })
    // }


    const task = await Task.create({ title, description, status, priority, dueDate })

    res.json({
      success: true,
      message: "Task Created successfully ✅",
      task
    })

  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Something was wrong ⛔️" + error.message
    })
  }
}
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, status, priority, dueDate } = req.body

    // ⏱️ DELAY 2 SECONDS to see optimistic update
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 🎲 Then fail randomly
    if (Math.random() > 0.5) {
      return res.status(500).json({
        error: true,
        message: "❌ Simulated error after delay"
      })
    }

    const task = await Task.findByPk(id)

    if (!task) {
      return res.status(404).json({
        error: true,
        message: `Task with id ${id} not exist`
      })
    }

    await task.update({
      title: title || task.title,
      description: description || task.description,
      status: status || task.status,
      priority: priority || task.priority,
      dueDate: dueDate || task.dueDate
    })

    res.json({
      success: true,
      message: "Task updated successfully ✅",
      task
    })
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Something was wrong ⛔️" + error.message
    })
  }
}

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params
    const task = await Task.findByPk(id)

    if (!task) {
      return res.json({
        error: true,
        message: `Taks with id ${id} not exist`
      })
    }

    // ⏱️ DELAY 2 SECONDS to see optimistic update
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 🎲 Then fail randomly
    if (Math.random() > 0.5) {
      return res.status(500).json({
        error: true,
        message: "❌ Simulated error after delay"
      })
    }


    await task.destroy()

    res.json({
      success: true,
      message: "Task deleted succesfully ✅"
    })

  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Something was wrong ⛔️" + error
    })
  }
}