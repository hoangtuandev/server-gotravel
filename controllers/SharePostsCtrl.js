import { SharePostsModel } from '../models/SharePosts.js';

export const getAllSharePosts = async (req, res) => {
    try {
        const result = await SharePostsModel.find();

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

export const getRejectSharePosts = async (req, res) => {
    try {
        const result = await SharePostsModel.find({
            bvcs_trangthai: 0,
        }).sort({
            bvcs_thoigian: -1,
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

export const getAcceptedSharePosts = async (req, res) => {
    try {
        const result = await SharePostsModel.find({
            bvcs_trangthai: 2,
        }).sort({
            bvcs_thoigian: -1,
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

export const getWaitingSharePosts = async (req, res) => {
    try {
        const result = await SharePostsModel.find({
            bvcs_trangthai: 1,
        }).sort({
            bvcs_thoigian: -1,
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

export const acceptSharePost = async (req, res) => {
    try {
        const idPosts = req.body.idPosts;

        const result = await SharePostsModel.updateOne(
            {
                bvcs_ma: idPosts,
            },
            {
                $set: {
                    bvcs_trangthai: 2,
                },
            }
        );
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

export const rejectSharePost = async (req, res) => {
    try {
        const idPosts = req.body.idPosts;

        const result = await SharePostsModel.updateOne(
            {
                bvcs_ma: idPosts,
            },
            {
                $set: {
                    bvcs_trangthai: 0,
                },
            }
        );
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

export const handleFavoriteSharePost = async (req, res) => {
    try {
        const user = req.body.user;
        const idPosts = req.body.idPosts;

        const posts = await SharePostsModel.find({
            bvcs_ma: idPosts,
        });

        const favoriteTimes = posts[0].bvcs_luotthich;
        favoriteTimes.push(user);

        await SharePostsModel.updateOne(
            {
                bvcs_ma: idPosts,
            },
            {
                $set: {
                    bvcs_luotthich: favoriteTimes,
                },
            }
        );
        const result = await SharePostsModel.find({
            bvcs_ma: idPosts,
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

export const handleDisFavoriteSharePost = async (req, res) => {
    try {
        const user = req.body.user;
        const idPosts = req.body.idPosts;

        const posts = await SharePostsModel.find({
            bvcs_ma: idPosts,
        });

        const favoriteTimes = posts[0].bvcs_luotthich.filter((favorite) => {
            return (
                favorite.tkkdl_khachdulich.kdl_ma !==
                user.tkkdl_khachdulich.kdl_ma
            );
        });

        await SharePostsModel.updateOne(
            {
                bvcs_ma: idPosts,
            },
            {
                $set: {
                    bvcs_luotthich: favoriteTimes,
                },
            }
        );
        const result = await SharePostsModel.find({
            bvcs_ma: idPosts,
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

export const searchingSharePosts = async (req, res) => {
    try {
        const key = req.body.keySearch;
        const status = req.body.currentStatus;

        function removeVietnameseTones(str) {
            str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, 'a');
            str = str.replace(/??|??|???|???|???|??|???|???|???|???|???/g, 'e');
            str = str.replace(/??|??|???|???|??/g, 'i');
            str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, 'o');
            str = str.replace(/??|??|???|???|??|??|???|???|???|???|???/g, 'u');
            str = str.replace(/???|??|???|???|???/g, 'y');
            str = str.replace(/??/g, 'd');
            str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, 'A');
            str = str.replace(/??|??|???|???|???|??|???|???|???|???|???/g, 'E');
            str = str.replace(/??|??|???|???|??/g, 'I');
            str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, 'O');
            str = str.replace(/??|??|???|???|??|??|???|???|???|???|???/g, 'U');
            str = str.replace(/???|??|???|???|???/g, 'Y');
            str = str.replace(/??/g, 'D');

            str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '');
            str = str.replace(/\u02C6|\u0306|\u031B/g, '');
            str = str.replace(/ + /g, ' ');
            str = str.trim();

            str = str.replace(
                /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
                ' '
            );
            return str;
        }
        const sharePosts = await SharePostsModel.find({
            bvcs_trangthai: status,
        });
        const convertKey = removeVietnameseTones(key).toLowerCase();

        const fillterPosts = (posts) => {
            return removeVietnameseTones(posts.bvcs_tieude)
                .toLowerCase()
                .includes(convertKey.toLowerCase());
        };

        const result = sharePosts.filter(fillterPosts);

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};
export const historySharePostsByTourist = async (req, res) => {
    try {
        const idAccount = req.body.idAccount;

        const sharePosts = await SharePostsModel.find();

        const result = sharePosts.filter((posts) => {
            return posts.bvcs_taikhoan._id.toString() === idAccount;
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};
