export const validateLogin = (email, password) => {
  if(!email) return " * Email is required";
  if(!/\S+@\S+\.\S+/.test(email)) return "Invalid email format";
  if(!password) return "Password is required";
  if(password.length < 6) return "Password must be at least 6 characters";
  return null;
};

export const validateCategory = (form) => {
  if (!form.name) return "Category name is required";
  if (form.name.length < 2) return "Category name too short";
  // if (!form.feed_message) return "Feed message is required";
  return null;
};

export const validateDelegate = (form) => {
  if (!form.first_name) return "First name is required";
  if (!form.last_name) return "Last name is required";
  if (!form.email) return "Email is required";
  if (!/\S+@\S+\.\S+/.test(form.email)) return "Invalid email format";
  if (!form.password && !form.id) return "Password is required";
  if (!form.category_id) return "Category is required";
  return null;
};
