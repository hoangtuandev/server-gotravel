import { GuideAccountModel } from '../models/GuideAccountModel.js';
import jwt from 'jsonwebtoken';
import { QuanlityGuideModel } from '../models/QualityGuideModel.js';

export const getAllGuideAccount = async (req, res) => {
    try {
        const result = await GuideAccountModel.find();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

export const getActiveGuideAccount = async (req, res) => {
    try {
        const result = await GuideAccountModel.find({ tkhdv_trangthai: 1 });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

export const getLockedGuideAccount = async (req, res) => {
    try {
        const result = await GuideAccountModel.find({ tkhdv_trangthai: 0 });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

export const handleLogin = async (req, res) => {
    try {
        const user = await GuideAccountModel.findOne({
            tkhdv_tendangnhap: req.body.username,
        });

        if (!user) {
            res.status(200).json({ notFoundUsername: true });
        } else if (user && user.tkhdv_matkhau === req.body.password) {
            const jwt_guide = jwt.sign(
                {
                    _id: user._id,
                    tkhdv_tendangnhap: user.tkhdv_tendangnhap,
                },
                process.env.JWT_ACCESS_GUIDE,
                { expiresIn: '30m' }
            );

            const { tkhdv_matkhau, ...others } = user._doc;
            res.status(200).json({ others, jwt_guide });
        } else {
            res.status(200).json({ wrongPassword: true });
        }
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

export const createAccountGuide = async (req, res) => {
    try {
        const newAccount = req.body;
        const result = new GuideAccountModel(newAccount);
        await result.save();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

export const updateProfileGuideOfAccount = async (req, res) => {
    try {
        const profile = req.body;
        const result = await GuideAccountModel.updateOne(
            {
                _id: profile._id,
            },
            {
                $set: {
                    tkhdv_huongdanvien: profile.tkhdv_huongdanvien,
                    tkhdv_anhdaidien: profile.tkhdv_anhdaidien,
                },
            }
        );
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

export const lockProfile = async (req, res) => {
    try {
        const profile = req.body;
        const result = await GuideAccountModel.updateOne(
            {
                _id: profile._id,
            },
            {
                $set: {
                    tkhdv_trangthai: 0,
                },
            }
        );
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

export const activeProfile = async (req, res) => {
    try {
        const profile = req.body;
        const result = await GuideAccountModel.updateOne(
            {
                _id: profile._id,
            },
            {
                $set: {
                    tkhdv_trangthai: 1,
                },
            }
        );
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

export const searchingGuide = async (req, res) => {
    try {
        const key = req.body.keySearch;

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
        const guideAccounts = await GuideAccountModel.find({
            tkhdv_trangthai: 1,
        });
        const convertKey = removeVietnameseTones(key).toLowerCase();

        const fillterAccountGuide = (account) => {
            return removeVietnameseTones(account.tkhdv_huongdanvien.hdv_hoten)
                .toLowerCase()
                .includes(convertKey.toLowerCase());
        };

        const result = guideAccounts.filter(fillterAccountGuide);

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

export const countAmountGuide = async (req, res) => {
    try {
        const amount = await GuideAccountModel.count();

        res.status(200).json(amount);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

export const sortAccountGuideByAverageStar = async (req, res) => {
    try {
        const typeSort = req.body.typeSort;
        const accounts = await GuideAccountModel.find({ tkhdv_trangthai: 1 });
        const qualitys = await QuanlityGuideModel.find().sort({
            clhdv_saotrungbinh: typeSort,
        });
        var result = [];
        for (let x = 0; x < qualitys.length; x++) {
            for (let y = 0; y < accounts.length; y++) {
                if (
                    qualitys[x].clhdv_huongdanvien.tkhdv_tendangnhap ===
                    accounts[y].tkhdv_tendangnhap
                ) {
                    result.push(accounts[y]);
                }
            }
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};
