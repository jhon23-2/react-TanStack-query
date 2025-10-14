export const create = async (newTask) => {
  try {
    const response = await fetch("http://localhost:3000/api/task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    throw new Error("Failed to create task: " + error.message);
  }
}

export const update = async (updateTask) => {
  try {
    const response = await fetch(`http://localhost:3000/api/task/${updateTask.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateTask),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.json();
  } catch (error) {
    throw new Error("Failed to update task: " + error.message);
  }
}

export const drop = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/api/task/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    throw new Error("Failed to drop task: " + error.message);
  }
}