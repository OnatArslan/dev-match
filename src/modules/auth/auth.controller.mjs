export async function registerController(req, res, next) {
  res.status(200).json({
    status: `Ok`,
    message: `registered successfully`,
  });
}
