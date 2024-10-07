import nodemailer from 'nodemailer'

const config = useRuntimeConfig()
const { smtpHost, smtpPort, smtpUser, smtpPass, privateKey } = config
const alias = smtpUser
const dkimKey = `-----BEGIN PRIVATE KEY-----
WgfPvmg8zCmyP5NHwe5M
-----END PRIVATE KEY-----`
class MailService {
  transporter: nodemailer.Transporter
  constructor() {
    this.transporter = nodemailer.createTransport({
      // @ts-expect-error nodemailer types bad
      host: smtpHost,
      port: smtpPort,
      secure: true,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      dkim: {
        domainName: 'rikrtop.ru',
        keySelector: 'mail',
        privateKey: dkimKey,
      },
    })
  }

  async sendActivationMail(to: string | undefined, link: string) {
    const result = await this.transporter.sendMail({
      from: alias,
      to,
      subject: '[RIKRTOP] Завершите регистрацию',
      text: '',
      html: `
                <div>
                <h2>Приветствуем!</h2>
                
                <h3>
                Вы успешно зарегистрировались 
                на платформе RIKRTOP
                </h3>
                <h3>
                Для завершения регистрации 
                вам необходимо перейти по ссылке
                </h3>

                <a href="${link}"><h2>https://app.rikrtop.ru/auth</h2></a>
                
                <p>
                Если вдруг вы не регистрировались и 
                данное письмо получили случайно, 
                просто его проигнорируйте
                </p>

                <p>
                Данное письмо было создано автоматически 
                и если вы напишите на него нам ответ, 
                мы не сможем его прочитать
                </p>




                <p>
                С уважением, Rikrtop      
                </p>          
                </div>
            `,
    })
    return result
  }
  async sendNewEmailActivationMail(to: string | undefined, link: string) {
    const result = await this.transporter.sendMail({
      from: alias,
      to,
      subject: '[MARKETMONSTR] Подтвердите новый адрес электронной почты',
      text: '',
      html: `
                <div>
                <h2>Приветствуем!</h2>
                
                <h3>
                Вы собираетесь сменить адрес электронной почты 
                на платформе MARKETMONSTR
                </h3>
                <h3>
                Для смены адреса электронной почты 
                вам необходимо перейти по ссылке
                </h3>

                <a href="${link}"><h2>https://app.marketmonstr.pro/auth</h2></a>
                
                <p>
                Если вдруг вы не сменяли адрес и 
                данное письмо получили случайно, 
                просто его проигнорируйте
                </p>

                <p>
                Данное письмо было создано автоматически 
                и если вы напишите на него нам ответ, 
                мы не сможем его прочитать
                </p>


                Все свои вопросы можете задавать тут
                
                <a href="https://t.me/Marketmonstr_bot">Поддержка</a>



                <p>
                Решайте любые задачи в MARKETMONSTR
                </p>
                <p>
                С уважением, служба заботы MARKETMONSTR      
                </p>          
                </div>
            `,
    })
    return result
  }

  async sendUnlinkTelgramMail(to: string | undefined, link: string) {
    const result = await this.transporter.sendMail({
      from: alias,
      to,
      subject: '[MARKETMONSTR] Подтверждение отвязки Telegram',
      text: '',
      html: `
                <div>
                    <h2>Для отвязки телеграма перейдите по ссылке</h2>
                    <a href="${link}"><h2>https://app.marketmonstr.pro/profile</h2></a>

                    <p>
                    Решайте любые задачи в MARKETMONSTR
                    </p>
                    <p>
                    С уважением, служба заботы MARKETMONSTR      
                    </p>    
                </div>
            `,
    })
    return result
  }

  async sendConsultation(name: string, email: string, phone: string) {
    const result = this.transporter.sendMail({
      from: alias,
      to: 'support@marketmonstr.pro',
      subject: '[MARKETMONSTR] Получить консультацию',
      text: '',
      html: `
                <div>
                    <p>
                    Имя пользователя: ${name}
                    </p>
                    <p>
                    Номер телефона: ${phone}
                    </p>
                    <p>
                    Электронная почта: ${email}
                    </p>
                
                </div>
            `,
    })
    return result
  }

  async sendChangePasswordMail(
    to: string | undefined,
    link: string,
    username: string
  ) {
    const result = this.transporter.sendMail({
      from: alias,
      to,
      subject: '[MARKETMONSTR] Запрос на смену пароля',
      text: '',
      html: `
                <div>
                    <h2>Привет, ${username}!</h2>
                    <h3>Вы или кто-то другой использовал функцию смены пароля для доступа к личному кабинету</h3>
                    <h3>Вы собираетесь сменить пароль! Если это сделали не вы, то проигнорируйте это сообщение.</h3>
                    <h3>Для подтверждения смены пароля перейдите по ссылке</h3>
                    <a href="${link}"><h2>https://app.marketmonstr.pro/auth</h2></a>

                    <p>
                    Решайте любые задачи в MARKETMONSTR
                    </p>
                    <p>
                    С уважением, служба заботы MARKETMONSTR      
                    </p>    
                </div>
            `,
    })
    return result
  }
}

export default new MailService()
