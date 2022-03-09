"use strict";
//sending email template
exports.template = function (id) {
  return `<div>
        
                <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:18px;font-weight:bold;line-height:1;text-align:center;color:#555;">
                    Please confirm your email
                </div>
                <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:16px;line-height:22px;text-align:center;color:#555;">
                    Thanks for signing up with Meet stranger! You must confim your email within 1 day to activate your account
                </div>
                <div style="text-align:center;margin:2rem;">
                    <a href=https://meet-stranger-adelphe.herokuapp.com/send/confirmation?tkn=${id}&q=1 target="_blank" style="background:#2F67F6;color:#ffffff;font-family:'Helvetica Neue',Arial,sans-serif;font-size:15px;font-weight:normal;line-height:120%;padding:1rem;text-decoration:none;text-transform:none;">
                        Confirm Your Email
                    </a>
                </div> <p style="text-align:center;margin:8px;">Or</p><br>
                <p>
                follow this link
                <a href=https://meet-stranger-adelphe.herokuapp.com/send/confirmation?tkn=${id}&q=1 target="_blank">
                    https://meet-stranger-adelphe.herokuapp.com/send/confirmation?tkn=${id}&q=1
                </a>
                </p>
                
                <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:18px;font-weight:bold;line-height:1;text-align:center;color:#555;">
                    Need Help?
                </div>
                <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:22px;text-align:center;color:#555;">
                    Please send and feedback or bug info<br> to <a href="mailto:adelpheRaime@gmail.com" style="color:#2F67F6">adelpheRaime@gmail.com</a><br>
                    <p style="text-align:center;margin:8px;">Or</p><br>
                    <a href="https://github.com/adelpheRaime/meet-stranger" style="color:#2F67F6">github issue</a>
                </div>
            </div>
            `;
};
