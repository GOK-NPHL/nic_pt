<?php

namespace App\Http\Controllers;

use App\ResourceFiles;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ResourceFilesController extends Controller
{
    //middleware auth
    // public function __construct()
    // {
    //     // $this->middleware('auth');
    //     // $this->middleware('auth:admin');
    // }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $fls = ResourceFiles::all();
        $is_admin = Auth::guard('admin')->check();
        if ($is_admin) {
            return view('interface.resources.index', compact('fls'));
        } else {
            $is_logged_in = Auth::check();
            if (!$is_logged_in) {
                return redirect('/');
            }
            return view('interface.resources.index_participant', compact('fls'));
        }
    }

    public function getAllFiles()
    {
        $files = ResourceFiles::all();
        $is_admin = Auth::guard('admin')->check();
        if ($is_admin) {
            return response()->json(['files' => $files, 'is_admin' => true]);
        } else {
            return response()->json(['files' => $files, 'is_admin' => false]);
        }
    }
    public function getPublicFiles()
    {
        $files = ResourceFiles::where('is_public', 1)->get();
        return response()->json($files);
    }

    public function getPrivateFiles()
    {
        $is_logged_in = Auth::check();
        if ($is_logged_in) {
            $files = ResourceFiles::where('is_public', 0)->get();
            return response()->json($files);
        } else {
            return redirect('/');
        }
        $files = ResourceFiles::where('is_public', 0)->get();
        return response()->json($files);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $is_logged_in = Auth::check();
        if (!$is_logged_in) {
            return redirect('/');
        }
        $banned_files = ['exe', 'sh', 'bat', 'php', 'go', 'js', 'py', 'rb', 'pl', 'sh', 'c', 'cpp', 'java', 'cs', 'html', 'css', 'json', 'xml', 'sql', 'dmg', null, 'bin', 'jar', 'ts', 'cpp'];

        $file = $request->file('file');
        $is_public = $request->input('isPublic');
        $name = $file->getClientOriginalName();
        $extension = $file->getClientOriginalExtension();
        if (in_array($extension, $banned_files)) {
            return response()->json(['status' => 'error', 'message' => 'File type not allowed', 'data' => ResourceFiles::all()]);
        }

        $is_public = $is_public ?? false;
        $path = storage_path('files/' . $name);
        $file->move(storage_path('files'), $name);
        $file = new ResourceFiles();
        $file->name = $name;
        $file->path = $path;
        $file->type = mime_content_type($path); //$file->getMimeType();
        $file->size = filesize($path); //$file->getSize();
        $file->is_public = $is_public;
        $file->save();
        $files = ResourceFiles::all();
        return response()->json(['status' => 'success', 'message' => 'File uploaded', 'data' => $files], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $is_logged_in = Auth::check();
        if (!$is_logged_in) {
            return redirect('/');
        }
        $file = ResourceFiles::find($id);
        return response()->json($file);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $is_logged_in = Auth::check();
        if (!$is_logged_in) {
            return redirect('/');
        }
        $file = ResourceFiles::find($id);
        $file->delete();
        //delete file
        if (file_exists($file->path)) {
            unlink($file->path);
        }
        $files = ResourceFiles::all();
        return response()->json(['status' => 'success', 'message' => 'File deleted', 'data' => $files], 200);
    }

    public function download($id)
    {
        $file = ResourceFiles::find($id);
        return response()->download($file->path);
    }
}
