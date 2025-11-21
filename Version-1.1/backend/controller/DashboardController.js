exports.renderDashboard = (req, res) => {
  res.render('dashboard', { user: req.user });
};