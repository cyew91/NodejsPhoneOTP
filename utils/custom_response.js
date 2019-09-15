const customResponse = {
    success: (res, data = {}, msg = "SUCCESS") => {
        return res.send({
            statusCode: 200,
            ...data,
        });
    },
};

module.exports = customResponse;
