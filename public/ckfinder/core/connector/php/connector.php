<?php
/*
 * CKFinder
 * ========
 * https://ckeditor.com/ckeditor-4/ckfinder/
 * Copyright (c) 2007-2022, CKSource Holding sp. z o.o. All rights reserved.
 *
 * The software, this file and its contents are subject to the CKFinder
 * License. Please read the license.txt file before using, installing, copying,
 * modifying or distribute this file or part of its contents. The contents of
 * this file is part of the Source Code of CKFinder.
 */

require_once __DIR__ . '/vendor/autoload.php';

use CKSource\CKFinder\CKFinder;

if (isset($_GET['diag'])) {
    header('Content-Type: application/json; charset=utf-8');

    $targetDir = dirname(__DIR__, 3) . '/userfiles/images/About';
    $result = [
        'time'              => date('c'),
        'php_version'       => PHP_VERSION,
        'file_uploads'      => ini_get('file_uploads'),
        'upload_tmp_dir'    => ini_get('upload_tmp_dir'),
        'upload_max_filesize' => ini_get('upload_max_filesize'),
        'post_max_size'     => ini_get('post_max_size'),
        'max_file_uploads'  => ini_get('max_file_uploads'),
        'memory_limit'      => ini_get('memory_limit'),
        'sys_temp_dir'      => sys_get_temp_dir(),
        'tmp_writable'      => is_writable(ini_get('upload_tmp_dir') ?: sys_get_temp_dir()),
        'target_dir'        => $targetDir,
        'target_exists'     => is_dir($targetDir),
        'target_writable'   => is_writable($targetDir),
        'request_method'    => $_SERVER['REQUEST_METHOD'] ?? null,
        'files_keys'        => array_keys($_FILES),
        'post_keys'         => array_keys($_POST),
    ];

    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST') {
        if (!isset($_FILES['upload'])) {
            $result['upload_status'] = 'missing_upload_field';
        } else {
            $file = $_FILES['upload'];
            $result['upload_meta'] = [
                'name'     => $file['name'] ?? null,
                'type'     => $file['type'] ?? null,
                'size'     => $file['size'] ?? null,
                'tmp_name' => $file['tmp_name'] ?? null,
                'error'    => $file['error'] ?? null,
            ];
            $result['is_uploaded_file'] = !empty($file['tmp_name']) ? is_uploaded_file($file['tmp_name']) : false;
            $result['tmp_exists'] = !empty($file['tmp_name']) ? file_exists($file['tmp_name']) : false;

            if (!empty($file['tmp_name'])) {
                $result['getimagesize'] = @getimagesize($file['tmp_name']);

                $dest = $targetDir . '/diag-' . basename($file['name']);
                $result['move_uploaded_file'] = @move_uploaded_file($file['tmp_name'], $dest);
                $result['dest_exists_after_move'] = file_exists($dest);

                if (file_exists($dest)) {
                    @unlink($dest);
                }
            }
        }
    }

    echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

$ckfinder = new CKFinder(__DIR__ . '/../../../config.php');

$ckfinder->run();
