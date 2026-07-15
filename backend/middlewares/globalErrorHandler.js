const globalErrorHanlder = (err, req, res, next) => {
   let statusCode = err.statusCode || 500;
   let message = err.message || 'Internal Server Error';
   if(err.code === '23505'){
     statusCode = 409;
     message='Conflict: A record with this unique value already exists.';
   } else if(err.code == '23503'){
     statusCode = 400;
     message = 'Bad Request: Related record not found (Foreign key restriction).';
   }else if(err.code === '22P02'){
     statusCode = 400;
     message = 'Bad Request: Invalid data format input.';
   }
   console.error(`[DB/Server Error] Code: ${err.code || 'N/A'} -`, err.stack);
   res.status(statusCode).json({
    status:'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
   })
}

module.exports = globalErrorHanlder;