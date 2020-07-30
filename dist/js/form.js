$(function () {
    $("form[name='joinform']").validate({
        rules: {
            firstname: "required",
            lastname: "required",
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                minlength: 5
            }
        },
        messages: {
            firstname: "Enter your firstname",
            lastname: "Enter your lastname",
            password: {
                required: "Provide a password",
                minlength: "Your password must be at least 5 characters long"
            },
            email: "Enter a valid email address"
        }
    });
});
