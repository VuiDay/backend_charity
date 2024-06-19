jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
    if (err) {
        return res.status(401).json(err);
    }
    // Delete RefreshToken in App
    reFreshTokens = reFreshTokens.filter((token) => token !== refreshToken);
    // Create new accessToken and refreshToken
    const newAccessToken = authController.generateAccessToken(user);
    const newRefreshToken = authController.generateRefreshToken(user);
    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        path: "/",
        sameSite: "strict",
        secure: false,
    });
    res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        path: "/",
        sameSite: "strict",
        secure: false,
    });
    reFreshTokens.push(newRefreshToken);
    res.status(200).json("Refresh Tokens Successfylly");
});







module.exports = authController;