import open3d as o3d
import numpy as np
import json
import os
import imageio.v2 as imageio
from tqdm import tqdm
import time

# 路径配置
mesh_path = "fuse_post.ply"
camera_json_path = "cameras.json"
output_dir = "frames"
output_video_path = "render_video.mp4"

# 加载 mesh
mesh = o3d.io.read_triangle_mesh(mesh_path)
mesh.compute_vertex_normals()

# 加载相机参数
with open(camera_json_path, 'r') as f:
    cameras = json.load(f)

# 创建窗口
vis = o3d.visualization.Visualizer()
vis.create_window(visible=True, width=640, height=480)  # 尺寸无所谓，我们用系统自己生成的intrinsic
vis.create_window(visible=True, width=1920, height=1080)  # 尺寸无所谓，我们用系统自己生成的intrinsic
vis.add_geometry(mesh)

# 创建帧目录
os.makedirs(output_dir, exist_ok=True)

# 渲染每一帧
for cam in tqdm(cameras):
    # 相机位姿变换（world to camera）
    R = np.array(cam["rotation"])
    t = np.array(cam["position"])
    T = np.eye(4)
    T[:3, :3] = R
    T[:3, 3] = t
    extrinsic = np.linalg.inv(T)

    # 获取系统生成的 intrinsic，避免尺寸不匹配问题
    ctr = vis.get_view_control()
    param = ctr.convert_to_pinhole_camera_parameters()  # 拿系统默认的 intrinsic，别自己构造
    param.extrinsic = extrinsic  # 只替换 extrinsic
    ctr.convert_from_pinhole_camera_parameters(param)

    vis.poll_events()
    vis.update_renderer()
    time.sleep(0.05)

    frame_path = os.path.join(output_dir, f"{cam['img_name']}.png")
    vis.capture_screen_image(frame_path)

vis.destroy_window()

# 合成视频
frame_files = sorted([os.path.join(output_dir, f"{cam['img_name']}.png") for cam in cameras])
writer = imageio.get_writer(output_video_path, fps=10, codec='libx264')
for frame_file in frame_files:
    writer.append_data(imageio.imread(frame_file))
writer.close()

print("✅ 渲染完成！输出视频：", output_video_path)
