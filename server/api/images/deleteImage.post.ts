import AWS from 'aws-sdk'
const config = useRuntimeConfig()

export default eventHandler(async (event) => {
  const { path }: any = await readBody(event) // Получаем путь из тела запроса

  if (!path) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Path is required',
    })
  }

  // Конфигурация S3
  AWS.config.update({
    accessKeyId: config.VK_ACCESS_KEY,
    secretAccessKey: config.VK_SECRET_KEY,
    endpoint: 'https://hb.vkcs.cloud',
  })

  const s3 = new AWS.S3()

  const params: AWS.S3.DeleteObjectRequest = {
    Bucket: 'photodlablyatskogosaita', // Указываем название bucket
    Key: path.replace('photodlablyatskogosaita/', ''), // Указываем ключ файла (удаляем префикс bucket)
  }

  try {
    // Удаление файла из VK Cloud
    await s3.deleteObject(params).promise()

    return {
      success: true,
      message: `Image ${path} successfully deleted`,
    }
  } catch (err) {
    console.error('Error deleting image:', err)

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete image',
    })
  }
})
