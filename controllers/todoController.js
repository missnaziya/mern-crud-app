const ErrorHandler = require('./../utilities/errorHandler')
const Todo = require('./../models/todoModel')



exports.addTodoList = async(req, res, next)=>{
    try {
        if(!req.body){
            return next(new ErrorHandler('Please provide a valid input.'));
        }
        req.body.user = req.user._id
        const list = await Todo.create(req.body)
        if(list && list._id){
            res.json({
                success: true,
                data: list
            })
        }else{
            return next(new ErrorHandler('Failed to create list.'));
        }
    } catch (err) {
        return next(err)
    }
}


exports.updateTodo = async(req, res, next)=>{
    try {
        if(!req.params && !req.params.todoId){
            return next(new ErrorHandler('Please provide a Todo ID'));
        }
        req.body.user = req.user._id
        const updatedTodo = await Todo.findByIdAndUpdate(req.params.todoId,req.body,{ new: true });
        if(updatedTodo && updatedTodo._id){
            res.json({
                success: true,
                data: updatedTodo
            })
        }else{
            return next(new ErrorHandler('Todo item not found.'));
        }
    } catch (err) {
        return next(err)
    }
}


exports.getById = async(req, res, next)=>{
    try {
        if(!req.params && !req.params.todoId){
            return next(new ErrorHandler('Please provide a Todo ID'));
        }
        const updatedTodo = await Todo.findById(req.params.todoId).populate({
            path: 'user',
            select: 'name' 
          });
        if(updatedTodo && updatedTodo._id){
            res.json({
                success: true,
                data: updatedTodo
            })
        }else{
            return next(new ErrorHandler('Todo item not found.'));
        }
    } catch (err) {
        return next(err)
    }
}

exports.deleteById = async(req, res, next)=>{
    try {
        if(!req.params && !req.params.todoId){
            return next(new ErrorHandler('Please provide a Todo ID'));
        }
        await Todo.findByIdAndDelete(req.params.todoId)
        res.json({
            success: true,
            message: "Todo deleted successfully."
        })
    } catch (err) {
        return next(err)
    }
}

exports.getAllTodo = async(req, res, next)=>{
    try {
        const query  = req.query;
        const aggregateQuery = [
            {
                $match: { user: req.user._id }
            },
            {
                $lookup: {
                    from: 'users',
                    let: { userId: '$user' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$_id', '$$userId'] }
                            }
                        },
                        {
                            $project: {
                                _id: 1, 
                                name: 1,
                                email: 1
                            }
                        }
                    ],
                    as: 'user'
                }
            },
            {
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true  // Preserve documents even if 'userArray' is empty or missing
                }
            },
        ];
        aggregateQuery.push({
            $sort: { _id: -1 },
        });

        if (query.search) {
            const search = query.search.trim()
                aggregateQuery.push({
                $match: {
                    $or: [
                        { title: { $regex: search, $options: 'i' } },
                        { description: { $regex: search, $options: 'i' } }
                    ]
                }
            });
        }   
        
        const countQuery = [
            ...aggregateQuery,
            { $group: { _id: null, totalCount: { $sum: 1 } } },
        ];
        
        let skip = 0;
        if (query.page) {
            skip = (parseInt(query.page) - 1) * parseInt(query.limit);
            aggregateQuery.push({ $skip: skip });
        }
        
        if (query.limit) {
            aggregateQuery.push({ $limit: +query.limit });
        }

        
        
        let result = await Todo.aggregate(aggregateQuery)
        .allowDiskUse(true)
        .exec();
        const totalResult = await Todo.aggregate(countQuery)
            .allowDiskUse(true)
            .exec();

        const totalCountResult = totalResult[0] ? totalResult[0].totalCount : 0;

        let hasMany = null;
        if (query.limit) {
            if (skip + result.length >= totalCountResult) {
            hasMany = false;
            } else {
            hasMany = true;
            }
        }
        res.json({
            list: result,
            count: result.length,
            total: totalCountResult,
            hasMany: hasMany,
            from: skip + 1,
            to: skip + result.length,
        });
    } catch (err) {
        return next(err)
    }   
}