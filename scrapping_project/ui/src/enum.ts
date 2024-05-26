enum SearchError{
    failed,
    nothingfound,
    noerror,
    suggestion
}

enum cardStatus{
    pending,
    crawling,
    success,
    failed
}
enum BlogError{
    notfound,
    failed,
    nothing
}

export  {SearchError,cardStatus,BlogError}