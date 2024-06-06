// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleDuplicateError = (err: any) => {
  const match = err.message.match(/name: "([^"]+)"/);

  const extractedMessage = match && match[1];

  const errorSources = [
    {
      path: '',
      message: `${extractedMessage} is already exists`,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: 'Duplicate Error',
    errorSources,
  };
};

export default handleDuplicateError;
