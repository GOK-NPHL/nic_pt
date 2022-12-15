<?php

use App\Admin;
use Illuminate\Database\Seeder;
use App\User;

class UserSeed extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $dataUser = array(

            array(
                'name' => 'NPHL',
                'email' => 'defaultnphluser@yahoo.com',
                'second_name' => 'User',
                'has_qc_access' => true,
                'has_pt_access' => true,
                'phone_number'=> '0710238034',
                'password' => '$2y$10$ELXDs9zNO0RfvA8ZLotQJuZm96QHA/B2WLClEmlz/wvsjiCCF6FjK',
                'laboratory_id' => 1,
                'is_active' => true,
                'created_at' => new \dateTime,
                'updated_at' => new \dateTime,
            ),
            array(
                'name' => 'Benzer Bett',
                'email' => 'benzerbett@yahoo.com',
                'second_name' => 'User',
                'has_qc_access' => true,
                'has_pt_access' => true,
                'phone_number'=> '0710202020',
                'password' => '$2y$10$dXeWgXS0KsBbFSrNmfBn2u6WCuZe2fq1nQhRm4t2zqraY61cg.w..',
                'laboratory_id' => 1,
                'is_active' => true,
                'created_at' => new \dateTime,
                'updated_at' => new \dateTime,
            ),
            array(
                'name' => 'Bett',
                'email' => 'benzerbett@ymail.com',
                'second_name' => 'User',
                'has_qc_access' => true,
                'has_pt_access' => true,
                'phone_number'=> '0712909090',
                'password' => '$2y$10$1zaJrReHthJ9lTFQ3Cot8.y1jFZrNpUlB9bsMa4LzZlwKf.8.E4z.',
                'laboratory_id' => 1,
                // 'roles' => json_encode(array(3)),
                'is_active' => true,
                'created_at' => new \dateTime,
                'updated_at' => new \dateTime,
            )

        );


        $dataAdmin = array(
            array(
                'name' => 'NPHL EQA',
                'email' => 'dlskneqas@gmail.com',
                'password' => '$2y$10$wCyQ7j2mwl.NGD3brp1RSuCo3nIv9b1pDO4Cb8v0xjmfBshm93bGm',
                'phone_number' => '0721333444',
                'is_admin' => true,
                'created_at' => new \dateTime,
                'updated_at' => new \dateTime,
            ),
            array(
                'name' => 'Bett',
                'email' => 'benzerbett@gmail.com',
                'password' => '$2y$10$DivpxnNxE9wBKoxXTyWSHus1GvCWFdZjevtohazhruxzG8HtUPh3W',
                'phone_number' => '0739611262',
                'is_admin' => true,
                'created_at' => new \dateTime,
                'updated_at' => new \dateTime,
            ),

        );


        $authObj = new User();
        User::query()->truncate();
        $authObj->insert($dataUser);

        //update user roles for all users for fresh install
        if (env('APP_ENV') == 'local') {
            $users = User::all();
            foreach ($users as $user) {
                $user->roles = json_encode(array(3));
                $user->save();
            }
        }

        $authObjAdmin = new Admin();
        Admin::query()->truncate();
        $authObjAdmin->insert($dataAdmin);
    }
}
